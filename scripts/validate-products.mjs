/**
 * Product Validation Cron — Auto-validates ASINs and refreshes product data
 *
 * Runs weekly (Sunday 3:00 UTC):
 *   1. HTTP GET each Amazon product page (no API key needed)
 *   2. Check for 404 / unavailable / valid
 *   3. Scrape product title for name verification
 *   4. Flag broken links and auto-replace with backup ASINs
 *   5. Track unavailable products — replace after 3 consecutive weeks
 *   6. Commit + push fixes to GitHub
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
const UNAVAIL_TRACKER_FILE = path.join(ROOT, "scripts", ".unavailable-tracker.json");
const UNAVAIL_THRESHOLD_WEEKS = 3; // Replace after 3 consecutive weeks unavailable

// ─── BACKUP PRODUCTS (55 verified working, anxiety/wellness niche) ───
const BACKUP_PRODUCTS = [
  // Books — Anxiety & Trauma
  { asin: "0143127748", name: "The Body Keeps the Score" },
  { asin: "155643233X", name: "Waking the Tiger" },
  { asin: "1572245379", name: "The Untethered Soul" },
  { asin: "1577314808", name: "The Power of Now" },
  { asin: "0553380990", name: "Full Catastrophe Living" },
  { asin: "1501144324", name: "When the Body Says No" },
  { asin: "0393712370", name: "The Polyvagal Theory in Therapy" },
  { asin: "1623170249", name: "Accessing the Healing Power of the Vagus Nerve" },
  { asin: "1101980389", name: "It Didn't Start with You" },
  { asin: "0735211299", name: "Atomic Habits" },
  { asin: "0593330447", name: "Unwinding Anxiety" },
  { asin: "1501197274", name: "The Courage to Be Disliked" },
  { asin: "1585429139", name: "Attached: The New Science of Adult Attachment" },
  { asin: "163286830X", name: "Lost Connections" },
  { asin: "0061142662", name: "Wherever You Go, There You Are" },
  { asin: "0399174826", name: "The Gifts of Imperfection" },
  { asin: "0380810336", name: "Don't Sweat the Small Stuff" },
  { asin: "1684034833", name: "The Anxiety and Phobia Workbook" },
  { asin: "1684034581", name: "The Dialectical Behavior Therapy Skills Workbook" },
  { asin: "0807014273", name: "My Grandmother's Hands" },
  { asin: "1400097665", name: "The Wisdom of Insecurity" },
  { asin: "1101982934", name: "Radical Acceptance" },
  { asin: "1501160842", name: "Option B" },
  { asin: "0140449337", name: "Meditations by Marcus Aurelius" },
  { asin: "0345536932", name: "Daring Greatly" },

  // Supplements
  { asin: "B00HD0ELFK", name: "Doctor's Best Magnesium Glycinate" },
  { asin: "B004U3Y9FU", name: "Nature Made Super B-Complex" },
  { asin: "B0040EGNIU", name: "NOW Supplements L-Theanine 200mg" },
  { asin: "B0013OUKBO", name: "Jarrow Formulas Methyl B-12 1000mcg" },
  { asin: "B001FYKXNQ", name: "Nature Made Vitamin B12" },
  { asin: "B002TSIMW4", name: "Nordic Naturals Omega-3" },
  { asin: "B00JU8P8VY", name: "Garden of Life Vitamin D3" },
  { asin: "B004O25V2C", name: "NOW Foods Ashwagandha" },

  // Body Tools & Massage
  { asin: "B01LP0V1GI", name: "Acupressure Mat and Pillow Set" },
  { asin: "B0892MWQR3", name: "Theragun Mini Percussion Massager" },
  { asin: "B000GOUV5K", name: "TheraCane Massager" },
  { asin: "B07B2T1JFZ", name: "Chirp Wheel Back Roller" },
  { asin: "B07H2517CF", name: "LiBa Back and Neck Massager" },

  // Sleep & Comfort
  { asin: "B01BT2BFKQ", name: "Marpac Dohm White Noise Machine" },
  { asin: "B08YRXJM1V", name: "Luna Adult Weighted Blanket" },
  { asin: "B07WFXPYP7", name: "Bearaby Napper Weighted Blanket" },
  { asin: "B00PCN4UVU", name: "Coop Home Goods Premium Pillow" },
  { asin: "B07VLLCQRS", name: "Hatch Restore Sound Machine" },

  // Aromatherapy
  { asin: "B00DQFGJYQ", name: "InnoGear Essential Oil Diffuser" },
  { asin: "B00016AITS", name: "Yogi Tea Calming Tea" },
  { asin: "B0093162RM", name: "Plant Therapy Lavender Essential Oil" },

  // Mindfulness & Journals
  { asin: "B01MAYGWNQ", name: "Mindfulness Cards" },
  { asin: "B07QBFG6PF", name: "Papier Joy Wellness Journal" },
  { asin: "B0BK3QJYXM", name: "Breathing Necklace Anxiety Relief" },
  { asin: "B01NCJMJPV", name: "Spire Stone Mindfulness Tracker" },

  // Fitness & Movement
  { asin: "B07PRG2CQB", name: "Gaiam Essentials Yoga Mat" },
  { asin: "B01GSFT4EY", name: "Fit Simplify Resistance Loop Bands" },

  // Tech Wellness
  { asin: "B09BFHH1QM", name: "Apollo Neuro Wearable" },
  { asin: "B0BJ9B1SQ8", name: "Sensate 2 Relaxation Device" },
  { asin: "B07BGZQXNF", name: "Muse 2 Brain Sensing Headband" },
  { asin: "B09GFPFQBQ", name: "Calm Premium Subscription Gift" },
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

// ─── UNAVAILABILITY TRACKER ───
// Persists a JSON file tracking how many consecutive weeks each ASIN has been unavailable.
// After UNAVAIL_THRESHOLD_WEEKS consecutive weeks, the ASIN gets auto-replaced.

function loadTracker() {
  try {
    if (fs.existsSync(UNAVAIL_TRACKER_FILE)) {
      return JSON.parse(fs.readFileSync(UNAVAIL_TRACKER_FILE, "utf-8"));
    }
  } catch (e) {
    console.warn("[validate-products] Could not load tracker, starting fresh");
  }
  return {};
}

function saveTracker(tracker) {
  fs.writeFileSync(UNAVAIL_TRACKER_FILE, JSON.stringify(tracker, null, 2), "utf-8");
}

/**
 * Update the unavailability tracker with this week's results.
 * Returns list of ASINs that have hit the threshold and should be replaced.
 */
function updateTracker(tracker, unavailableASINs, validASINs) {
  const now = new Date().toISOString();
  const toReplace = [];

  // Increment count for currently unavailable ASINs
  for (const asin of unavailableASINs) {
    if (!tracker[asin]) {
      tracker[asin] = { consecutiveWeeks: 0, firstSeen: now, lastSeen: now };
    }
    tracker[asin].consecutiveWeeks += 1;
    tracker[asin].lastSeen = now;

    if (tracker[asin].consecutiveWeeks >= UNAVAIL_THRESHOLD_WEEKS) {
      toReplace.push(asin);
      console.log(
        `[validate-products] ${asin} unavailable for ${tracker[asin].consecutiveWeeks} consecutive weeks — replacing`
      );
    } else {
      console.log(
        `[validate-products] ${asin} unavailable (${tracker[asin].consecutiveWeeks}/${UNAVAIL_THRESHOLD_WEEKS} weeks)`
      );
    }
  }

  // Reset count for ASINs that came back
  for (const asin of validASINs) {
    if (tracker[asin]) {
      console.log(`[validate-products] ${asin} is back in stock — resetting tracker`);
      delete tracker[asin];
    }
  }

  // Clean up replaced ASINs from tracker
  for (const asin of toReplace) {
    delete tracker[asin];
  }

  return toReplace;
}

/**
 * Check a single ASIN via HTTP GET.
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

    const is404 =
      resp.status === 404 ||
      pageTitle.includes("Page Not Found") ||
      html.toLowerCase().includes("page you requested was not found");

    const isUnavailable = html.toLowerCase().includes("currently unavailable");

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
 * Extract all unique ASINs from file content.
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
 * Pick a backup ASIN that isn't the broken one and preferably isn't already in heavy use.
 */
function pickBackup(brokenAsin, inUseASINs, usedBackupIdx) {
  // Filter out the broken ASIN itself from backups
  const candidates = BACKUP_PRODUCTS.filter((p) => p.asin !== brokenAsin);
  if (candidates.length === 0) return null;

  // Prefer backups not already in use, but allow reuse if needed
  const fresh = candidates.filter((p) => !inUseASINs.has(p.asin));
  const pool = fresh.length > 0 ? fresh : candidates;

  const pick = pool[usedBackupIdx.value % pool.length];
  usedBackupIdx.value++;
  return pick;
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

  // Check each ASIN with rate limiting (2s between batches, 3 concurrent)
  const results = [];
  const batchSize = 3;

  for (let i = 0; i < allASINs.length; i += batchSize) {
    const batch = allASINs.slice(i, i + batchSize);
    const batchResults = await Promise.all(batch.map(checkASIN));
    results.push(...batchResults);
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

  // ─── UNAVAILABILITY TRACKING ───
  // Load tracker, update with this week's results, get ASINs that hit threshold
  const tracker = loadTracker();
  const unavailASINs = unavailable.map((r) => r.asin);
  const validASINs = valid.map((r) => r.asin);
  const thresholdReplacements = updateTracker(tracker, unavailASINs, validASINs);
  saveTracker(tracker);

  // Combine: replace all 404s immediately + unavailable ASINs that hit the 3-week threshold
  const toReplace = [
    ...dead,
    ...thresholdReplacements.map((asin) => ({
      asin,
      status: "UNAVAILABLE_THRESHOLD",
      title: unavailable.find((r) => r.asin === asin)?.title || "Unknown",
    })),
  ];

  if (toReplace.length === 0) {
    console.log("[validate-products] No ASINs need replacement. All good!");
    return;
  }

  console.log(`[validate-products] Replacing ${toReplace.length} ASINs...`);
  console.log(`  404s: ${dead.length}`);
  console.log(`  Unavailable (hit ${UNAVAIL_THRESHOLD_WEEKS}-week threshold): ${thresholdReplacements.length}`);

  // Get ASINs currently in use
  const inUseASINs = new Set(allASINs);
  const usedBackupIdx = { value: 0 };
  let replacements = 0;

  for (const broken of toReplace) {
    const backup = pickBackup(broken.asin, inUseASINs, usedBackupIdx);
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
        `git commit -m "validate-products: replaced ${replacements} ASINs (${dead.length} dead, ${thresholdReplacements.length} unavailable)"`,
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
    thresholdReplacements,
    rateLimited: rateLimited.length,
    replacements,
    trackerState: tracker,
  };
  console.log("[validate-products] Summary:", JSON.stringify(summary, null, 2));
}

export { runProductValidation };
