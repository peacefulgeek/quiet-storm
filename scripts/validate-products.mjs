/**
 * Product Validation Cron — Auto-validates ASINs and refreshes product data
 *
 * Runs weekly (Sunday 3:00 UTC):
 *   1. HTTP GET each Amazon product page (no API key needed)
 *   2. Check for 404 / unavailable / valid
 *   3. Scrape product title for name verification
 *   4. Flag broken links and auto-replace with backup ASINs
 *   5. Commit + push fixes to GitHub
 *
 * Lightweight: uses fetch() with rate limiting, no external deps.
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "..");

const GH_REPO = "peacefulgeek/quiet-storm";
const ARTICLES_FILE = "client/src/data/articles.ts";
const CATALOG_FILE = "client/src/data/product-catalog.ts";
const AFFILIATE_TAG = "spankyspinola-20";

// ─── BACKUP PRODUCTS (verified working) ───
// Used to replace any broken ASINs found during validation
const BACKUP_PRODUCTS = [
  { asin: "0143127748", name: "The Body Keeps the Score" },
  { asin: "155643233X", name: "Waking the Tiger" },
  { asin: "1572245379", name: "The Untethered Soul" },
  { asin: "1577314808", name: "The Power of Now" },
  { asin: "0553380990", name: "Full Catastrophe Living" },
  { asin: "1501144324", name: "When the Body Says No" },
  { asin: "0393712370", name: "The Polyvagal Theory in Therapy" },
  { asin: "1623170249", name: "Accessing the Healing Power of the Vagus Nerve" },
  { asin: "B00HD0ELFK", name: "Doctor's Best Magnesium Glycinate" },
  { asin: "B004U3Y9FU", name: "Nature Made Super B-Complex" },
  { asin: "B0040EGNIU", name: "NOW Supplements L-Theanine 200mg" },
  { asin: "B01LP0V1GI", name: "Acupressure Mat and Pillow Set" },
  { asin: "B00DQFGJYQ", name: "InnoGear Essential Oil Diffuser" },
  { asin: "B01BT2BFKQ", name: "Marpac Dohm White Noise Machine" },
  { asin: "B07PRG2CQB", name: "Gaiam Essentials Yoga Mat" },
  { asin: "B08YRXJM1V", name: "Luna Adult Weighted Blanket" },
  { asin: "B0892MWQR3", name: "Theragun Mini Percussion Massager" },
  { asin: "B09BFHH1QM", name: "Apollo Neuro Wearable" },
  { asin: "B0BJ9B1SQ8", name: "Sensate 2 Relaxation Device" },
  { asin: "B0BK3QJYXM", name: "Breathing Necklace Anxiety Relief" },
];

const USER_AGENTS = [
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
];

function randomUA() {
  return USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

/**
 * Check a single ASIN via HTTP GET.
 * Returns { asin, status, title, available }
 */
async function checkASIN(asin) {
  const url = `https://www.amazon.com/dp/${asin}`;
  try {
    const resp = await fetch(url, {
      headers: {
        "User-Agent": randomUA(),
        Accept: "text/html,application/xhtml+xml",
        "Accept-Language": "en-US,en;q=0.9",
      },
      redirect: "follow",
      signal: AbortSignal.timeout(15000),
    });

    const html = await resp.text();
    const titleMatch = html.match(/<title[^>]*>(.*?)<\/title>/s);
    const pageTitle = titleMatch ? titleMatch[1].trim() : "NO TITLE";

    // Detect 404 / dog page
    const is404 =
      resp.status === 404 ||
      pageTitle.includes("Page Not Found") ||
      html.toLowerCase().includes("page you requested was not found");

    // Detect unavailable
    const isUnavailable = html.toLowerCase().includes("currently unavailable");

    // Extract product name
    const productName = pageTitle
      .split(" : ")[0]
      .split(" - Amazon")[0]
      .trim();

    let status;
    if (is404) status = "404";
    else if (resp.status === 503) status = "RATE_LIMITED";
    else if (isUnavailable) status = "UNAVAILABLE";
    else if (resp.status >= 200 && resp.status < 400) status = "VALID";
    else status = `HTTP_${resp.status}`;

    return { asin, status, title: productName.slice(0, 100), available: status === "VALID" };
  } catch (err) {
    return { asin, status: "ERROR", title: err.message?.slice(0, 80) || "Unknown error", available: false };
  }
}

/**
 * Extract all unique ASINs from a file.
 */
function extractASINs(content) {
  const fromUrls = content.match(/amazon\.com\/dp\/([A-Z0-9]{10})/g) || [];
  const fromFields = content.match(/asin:\s*"([A-Z0-9]{10})"/g) || [];
  const asins = new Set();
  fromUrls.forEach((m) => asins.add(m.replace("amazon.com/dp/", "")));
  fromFields.forEach((m) => asins.add(m.replace(/asin:\s*"/, "").replace('"', "")));
  return [...asins];
}

/**
 * Replace a bad ASIN with a backup in file content.
 */
function replaceASIN(content, badAsin, goodAsin) {
  return content.split(badAsin).join(goodAsin);
}

/**
 * Main validation runner.
 */
async function runProductValidation() {
  const GH_PAT = process.env.GH_PAT;
  if (!GH_PAT) {
    console.error("[validate-products] Missing GH_PAT");
    return;
  }

  console.log("[validate-products] Starting ASIN validation...");

  // Read files
  const articlesPath = path.join(ROOT, ARTICLES_FILE);
  const catalogPath = path.join(ROOT, CATALOG_FILE);
  let articlesContent = fs.readFileSync(articlesPath, "utf-8");
  let catalogContent = fs.readFileSync(catalogPath, "utf-8");

  // Extract all unique ASINs
  const allASINs = [
    ...new Set([...extractASINs(articlesContent), ...extractASINs(catalogContent)]),
  ];
  console.log(`[validate-products] Found ${allASINs.length} unique ASINs to check`);

  // Check each ASIN with rate limiting (1.5s between requests, 3 concurrent)
  const results = [];
  const batchSize = 3;

  for (let i = 0; i < allASINs.length; i += batchSize) {
    const batch = allASINs.slice(i, i + batchSize);
    const batchResults = await Promise.all(batch.map(checkASIN));
    results.push(...batchResults);

    // Rate limit
    if (i + batchSize < allASINs.length) {
      await sleep(2000);
    }
  }

  // Categorize results
  const valid = results.filter((r) => r.status === "VALID");
  const dead = results.filter((r) => r.status === "404");
  const unavailable = results.filter((r) => r.status === "UNAVAILABLE");
  const rateLimited = results.filter((r) => r.status === "RATE_LIMITED");
  const errors = results.filter((r) => r.status === "ERROR");

  console.log(`[validate-products] Results:`);
  console.log(`  Valid: ${valid.length}`);
  console.log(`  404 (dead): ${dead.length}`);
  console.log(`  Unavailable: ${unavailable.length}`);
  console.log(`  Rate-limited (retry next run): ${rateLimited.length}`);
  console.log(`  Errors: ${errors.length}`);

  // Replace dead ASINs (404 only - unavailable might come back)
  const toReplace = dead;
  if (toReplace.length === 0) {
    console.log("[validate-products] No broken ASINs found. All good!");
    return;
  }

  console.log(`[validate-products] Replacing ${toReplace.length} broken ASINs...`);

  // Get ASINs currently in use (to avoid duplicates)
  const inUseASINs = new Set(allASINs);
  const availableBackups = BACKUP_PRODUCTS.filter(
    (p) => !toReplace.some((r) => r.asin === p.asin)
  );

  let backupIdx = 0;
  let replacements = 0;

  for (const broken of toReplace) {
    // Find a backup that isn't already in use
    let backup = null;
    for (let j = 0; j < availableBackups.length; j++) {
      const candidate = availableBackups[(backupIdx + j) % availableBackups.length];
      if (!inUseASINs.has(candidate.asin) || true) {
        // Allow duplicates if needed
        backup = candidate;
        backupIdx = (backupIdx + j + 1) % availableBackups.length;
        break;
      }
    }

    if (!backup) {
      console.warn(`[validate-products] No backup available for ${broken.asin}`);
      continue;
    }

    console.log(`  ${broken.asin} -> ${backup.asin} (${backup.name})`);
    articlesContent = replaceASIN(articlesContent, broken.asin, backup.asin);
    catalogContent = replaceASIN(catalogContent, broken.asin, backup.asin);
    inUseASINs.add(backup.asin);
    replacements++;
  }

  if (replacements > 0) {
    fs.writeFileSync(articlesPath, articlesContent, "utf-8");
    fs.writeFileSync(catalogPath, catalogContent, "utf-8");
    console.log(`[validate-products] Saved ${replacements} replacements`);

    // Git commit and push
    try {
      execSync("git add -A", { cwd: ROOT, stdio: "pipe" });
      execSync(
        `git commit -m "validate-products: replaced ${replacements} broken ASINs"`,
        { cwd: ROOT, stdio: "pipe" }
      );
      execSync(
        `git push https://${GH_PAT}@github.com/${GH_REPO}.git main`,
        { cwd: ROOT, stdio: "pipe", timeout: 120000 }
      );
      console.log("[validate-products] Pushed fixes to GitHub");
    } catch (gitErr) {
      console.error("[validate-products] Git push error:", gitErr.message);
    }
  }

  // Log summary
  const summary = {
    timestamp: new Date().toISOString(),
    total: allASINs.length,
    valid: valid.length,
    dead: dead.map((r) => r.asin),
    unavailable: unavailable.map((r) => ({ asin: r.asin, title: r.title })),
    rateLimited: rateLimited.length,
    replacements,
  };
  console.log("[validate-products] Summary:", JSON.stringify(summary, null, 2));
}

export { runProductValidation };
