/**
 * Content Refresh Cron — Revises existing articles on a schedule
 *
 * Every 30 days: Revise 25 articles (expand 1 paragraph + humanization edits)
 * Every 90 days: Revise 20 articles (edit 1 paragraph + add 1-2 sentences)
 *
 * Uses cheaper AI (Claude Haiku) for revisions.
 * Applies the same humanization rules as new article generation.
 *
 * ALL secrets from process.env (Render env vars). NEVER hardcode API keys.
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

// ─── BANNED AI WORDS ───
const BANNED_WORDS = [
  "profound", "profoundly", "transformative", "holistic", "nuanced",
  "multifaceted", "tapestry", "delve", "delves", "delving",
  "embark", "embarking", "embarks", "realm", "realms",
  "unveil", "unveils", "unveiling", "leverage", "leveraging", "leverages",
  "paradigm", "paradigms", "synergy", "robust", "cutting-edge",
  "groundbreaking", "pivotal", "fostering", "fosters", "foster",
  "harnessing", "harness", "harnesses", "navigating", "navigate", "navigates",
  "landscape", "landscapes", "intricate", "comprehensive",
  "furthermore", "moreover", "encompasses", "encompass", "encompassing",
  "myriad", "plethora", "utilize", "utilizes", "utilizing", "utilization",
  "facilitate", "facilitates", "facilitating", "juxtaposition",
  "dichotomy", "epitome", "culmination", "underpinning", "underpinnings",
  "elucidates", "elucidate", "elucidating", "amalgamation",
  "quintessential", "paramount", "meticulous", "meticulously",
  "resonate", "resonates", "resonating", "resonance",
];

// ─── AI WORD REPLACEMENTS (same as generate-articles.mjs) ───
const AI_REPLACEMENTS = {
  "profound": ["deep", "real", "striking", "significant", "genuine"],
  "profoundly": ["deeply", "really", "genuinely", "remarkably"],
  "transformative": ["life-changing", "game-changing", "powerful", "significant"],
  "holistic": ["whole-person", "full-picture", "integrated", "complete"],
  "nuanced": ["layered", "subtle", "complex", "detailed"],
  "multifaceted": ["many-sided", "complex", "layered", "varied"],
  "tapestry": ["fabric", "web", "pattern", "weave"],
  "delve": ["dig into", "explore", "look at", "get into"],
  "delves": ["digs into", "explores", "looks at", "gets into"],
  "delving": ["digging into", "exploring", "looking at", "getting into"],
  "embark": ["start", "begin", "set out on", "take on"],
  "realm": ["area", "space", "world", "territory", "domain"],
  "realms": ["areas", "spaces", "worlds", "territories"],
  "unveil": ["reveal", "show", "uncover", "expose"],
  "leverage": ["use", "tap into", "draw on", "work with"],
  "paradigm": ["framework", "model", "approach", "way of thinking"],
  "synergy": ["connection", "overlap", "interplay"],
  "robust": ["strong", "solid", "reliable", "sturdy"],
  "cutting-edge": ["leading", "latest", "current", "modern"],
  "groundbreaking": ["pioneering", "fresh", "original", "new"],
  "pivotal": ["key", "critical", "central", "important"],
  "fostering": ["building", "growing", "encouraging", "supporting"],
  "harnessing": ["using", "channeling", "working with"],
  "navigating": ["moving through", "working through", "handling"],
  "landscape": ["terrain", "field", "territory", "ground"],
  "intricate": ["detailed", "complex", "elaborate", "involved"],
  "comprehensive": ["full", "thorough", "complete", "wide-ranging"],
  "furthermore": ["also", "and", "plus", "on top of that"],
  "moreover": ["also", "on top of that", "and", "what's more"],
  "encompasses": ["includes", "covers", "takes in", "holds"],
  "myriad": ["many", "countless", "numerous", "a range of"],
  "plethora": ["many", "plenty of", "a lot of", "a range of"],
  "utilize": ["use", "apply", "work with"],
  "facilitate": ["help", "support", "enable", "make possible"],
  "paramount": ["essential", "critical", "vital", "key"],
  "meticulous": ["careful", "thorough", "detailed"],
  "resonate": ["connect", "land", "hit home", "ring true"],
};

/**
 * Replace AI words in text.
 */
function replaceAIWords(text) {
  let result = text;
  for (const [word, alts] of Object.entries(AI_REPLACEMENTS)) {
    const regex = new RegExp(`\\b${word.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')}\\b`, "gi");
    result = result.replace(regex, (match) => {
      const alt = alts[Math.floor(Math.random() * alts.length)];
      if (match[0] === match[0].toUpperCase()) {
        return alt.charAt(0).toUpperCase() + alt.slice(1);
      }
      return alt;
    });
  }
  return result;
}

/**
 * Remove em-dashes from text.
 */
function removeEmDashes(text) {
  return text.replace(/\u2014/g, " - ").replace(/\u2013/g, " - ");
}

/**
 * Count words in HTML text.
 */
function countWords(html) {
  return html.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;
}

/**
 * 30-day refresh: Expand 1 paragraph + humanization edits
 */
async function refresh30Day(articleBody, articleTitle, ANTHROPIC_API_KEY) {
  const bannedWordsList = BANNED_WORDS.join(", ");

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-3-5-haiku-20241022",
      max_tokens: 4096,
      messages: [
        {
          role: "user",
          content: `You are Kalesh - consciousness teacher and writer. Direct, unflinching, compassionate. Somatic and Vedantic frameworks. Conversational and warm.

Take this article body and make these specific edits:
1. Pick ONE paragraph in the middle third and expand it by 2-3 sentences. Add a personal observation, a research detail, or a practical tip.
2. Fix any remaining AI-sounding language. NEVER use these words: ${bannedWordsList}
3. Remove any em-dashes (use " - " or "..." instead).
4. Make sure the total stays between 1200-1800 words.

Title: ${articleTitle}

Current body:
${articleBody}

Return ONLY the revised body HTML. No explanation. No wrapper. Just the HTML.`,
        },
      ],
    }),
  });

  if (!response.ok) {
    console.error(`[refresh-30] API error: ${response.status}`);
    return null;
  }

  const data = await response.json();
  let revised = data.content[0].text;

  // Post-process
  revised = removeEmDashes(revised);
  revised = replaceAIWords(revised);

  const wc = countWords(revised);
  if (wc < 1200 || wc > 1800) {
    console.warn(`[refresh-30] Word count ${wc} outside range for "${articleTitle}"`);
    return null; // Skip this one rather than publish bad content
  }

  return revised;
}

/**
 * 90-day refresh: Edit 1 paragraph + add 1-2 sentences
 */
async function refresh90Day(articleBody, articleTitle, ANTHROPIC_API_KEY) {
  const bannedWordsList = BANNED_WORDS.join(", ");

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-3-5-haiku-20241022",
      max_tokens: 4096,
      messages: [
        {
          role: "user",
          content: `You are Kalesh - consciousness teacher and writer. Direct, unflinching, compassionate.

Take this article body and make these specific edits:
1. Pick ONE paragraph and rewrite it slightly - same meaning, fresher language.
2. Add 1-2 new sentences somewhere natural (a research update, a reader insight, or a practical note).
3. NEVER use these words: ${bannedWordsList}
4. Remove any em-dashes (use " - " or "..." instead).
5. Keep total between 1200-1800 words.

Title: ${articleTitle}

Current body:
${articleBody}

Return ONLY the revised body HTML. No explanation.`,
        },
      ],
    }),
  });

  if (!response.ok) {
    console.error(`[refresh-90] API error: ${response.status}`);
    return null;
  }

  const data = await response.json();
  let revised = data.content[0].text;

  revised = removeEmDashes(revised);
  revised = replaceAIWords(revised);

  const wc = countWords(revised);
  if (wc < 1200 || wc > 1800) {
    console.warn(`[refresh-90] Word count ${wc} outside range for "${articleTitle}"`);
    return null;
  }

  return revised;
}

/**
 * Main refresh runner.
 * Called by cron-worker on schedule.
 */
async function runContentRefresh(refreshType = "30day") {
  const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
  const GH_PAT = process.env.GH_PAT;

  if (!ANTHROPIC_API_KEY || !GH_PAT) {
    console.error("[content-refresh] Missing API keys");
    return;
  }

  const articlesPath = path.join(ROOT, ARTICLES_FILE);
  let articlesContent = fs.readFileSync(articlesPath, "utf-8");

  // Parse article slugs and bodies (simplified extraction)
  const bodyRegex = /"slug":\s*"([^"]+)"[\s\S]*?"body":\s*"((?:[^"\\]|\\.)*)"/g;
  const articles = [];
  let match;
  while ((match = bodyRegex.exec(articlesContent)) !== null) {
    articles.push({ slug: match[1], body: match[2] });
  }

  const count = refreshType === "30day" ? 25 : 20;
  const refreshFn = refreshType === "30day" ? refresh30Day : refresh90Day;

  // Select articles to refresh (round-robin based on date)
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
  const startIdx = (dayOfYear * count) % articles.length;
  const selected = [];
  for (let i = 0; i < count && i < articles.length; i++) {
    selected.push(articles[(startIdx + i) % articles.length]);
  }

  console.log(`[content-refresh] ${refreshType}: Refreshing ${selected.length} articles`);

  let updated = 0;
  for (const art of selected) {
    try {
      // Extract title from the article (simplified)
      const titleMatch = articlesContent.match(new RegExp(`"slug":\\s*"${art.slug}"[\\s\\S]*?"title":\\s*"([^"]+)"`));
      const title = titleMatch ? titleMatch[1] : art.slug;

      const revisedBody = await refreshFn(art.body, title, ANTHROPIC_API_KEY);
      if (revisedBody) {
        // Replace body in articles content
        const escapedBody = JSON.stringify(revisedBody).slice(1, -1); // Remove outer quotes
        const oldBodyEscaped = art.body;
        articlesContent = articlesContent.replace(
          `"body": "${oldBodyEscaped}"`,
          `"body": "${escapedBody}"`
        );
        updated++;
        console.log(`[content-refresh] Updated: ${title}`);
      }

      // Rate limit: wait 2s between API calls
      await new Promise((r) => setTimeout(r, 2000));
    } catch (err) {
      console.error(`[content-refresh] Error refreshing ${art.slug}:`, err.message);
    }
  }

  if (updated > 0) {
    fs.writeFileSync(articlesPath, articlesContent, "utf-8");
    console.log(`[content-refresh] Saved ${updated} updates`);

    // Git commit and push
    try {
      execSync("git add -A", { cwd: ROOT, stdio: "pipe" });
      execSync(
        `git commit -m "content-refresh: ${refreshType} - ${updated} articles updated"`,
        { cwd: ROOT, stdio: "pipe" }
      );
      execSync(
        `git push https://${GH_PAT}@github.com/${GH_REPO}.git main`,
        { cwd: ROOT, stdio: "pipe", timeout: 120000 }
      );
      console.log("[content-refresh] Pushed to GitHub");
    } catch (gitErr) {
      console.error("[content-refresh] Git push error:", gitErr.message);
    }
  } else {
    console.log("[content-refresh] No articles updated this cycle");
  }
}

export { runContentRefresh };
