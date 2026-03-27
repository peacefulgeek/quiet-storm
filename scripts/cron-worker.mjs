/**
 * Cron Worker — Runs Mon-Fri at 12:00 UTC
 * Generates 1 article per run (5/week)
 * 600s timeout per generation
 */

import { generateArticle, AUTO_GEN_ENABLED } from "./generate-articles.mjs";

const CRON_INTERVAL_MS = 60 * 1000; // Check every minute
const TARGET_HOUR = 12; // UTC
const TARGET_MINUTE = 0;
const TIMEOUT_MS = 600 * 1000; // 600s

let lastRunDate = null;

function isWeekday(date) {
  const day = date.getUTCDay();
  return day >= 1 && day <= 5;
}

function shouldRun(now) {
  if (!AUTO_GEN_ENABLED) return false;
  if (!isWeekday(now)) return false;

  const dateKey = now.toISOString().slice(0, 10);
  if (lastRunDate === dateKey) return false;

  if (now.getUTCHours() === TARGET_HOUR && now.getUTCMinutes() === TARGET_MINUTE) {
    return true;
  }
  return false;
}

async function runWithTimeout() {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const article = await generateArticle();
    if (article) {
      console.log(`[cron] Successfully generated: ${article.title}`);
      lastRunDate = new Date().toISOString().slice(0, 10);
    }
  } catch (err) {
    if (err.name === "AbortError") {
      console.error("[cron] Generation timed out after 600s");
    } else {
      console.error("[cron] Error:", err.message);
    }
  } finally {
    clearTimeout(timeout);
  }
}

function startCron() {
  console.log(`[cron] Worker started. AUTO_GEN_ENABLED: ${AUTO_GEN_ENABLED}`);
  console.log(`[cron] Schedule: Mon-Fri 12:00 UTC`);

  setInterval(() => {
    const now = new Date();
    if (shouldRun(now)) {
      console.log(`[cron] Triggering article generation at ${now.toISOString()}`);
      runWithTimeout();
    }
  }, CRON_INTERVAL_MS);
}

export { startCron };
