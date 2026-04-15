/**
 * Cron Worker — Runs all scheduled tasks
 *
 * Article Generation: Mon-Fri at 12:00 UTC (1 article per run)
 * Content Refresh (30-day): 1st of each month at 03:00 UTC
 * Content Refresh (90-day): 1st of Jan, Apr, Jul, Oct at 04:00 UTC
 *
 * 600s timeout per generation, 1800s for refresh cycles.
 */

import { generateArticle, AUTO_GEN_ENABLED } from "./generate-articles.mjs";
import { runContentRefresh } from "./content-refresh.mjs";

const CRON_INTERVAL_MS = 60 * 1000; // Check every minute
const GEN_TIMEOUT_MS = 600 * 1000; // 600s for article generation
const REFRESH_TIMEOUT_MS = 1800 * 1000; // 1800s for content refresh

let lastGenDate = null;
let lastRefresh30Date = null;
let lastRefresh90Date = null;

function isWeekday(date) {
  const day = date.getUTCDay();
  return day >= 1 && day <= 5;
}

function shouldGenerate(now) {
  if (!AUTO_GEN_ENABLED) return false;
  if (!isWeekday(now)) return false;

  const dateKey = now.toISOString().slice(0, 10);
  if (lastGenDate === dateKey) return false;

  if (now.getUTCHours() === 12 && now.getUTCMinutes() === 0) {
    return true;
  }
  return false;
}

function shouldRefresh30(now) {
  if (!AUTO_GEN_ENABLED) return false;

  const monthKey = now.toISOString().slice(0, 7); // YYYY-MM
  if (lastRefresh30Date === monthKey) return false;

  // 1st of month at 03:00 UTC
  if (now.getUTCDate() === 1 && now.getUTCHours() === 3 && now.getUTCMinutes() === 0) {
    return true;
  }
  return false;
}

function shouldRefresh90(now) {
  if (!AUTO_GEN_ENABLED) return false;

  const quarterKey = `${now.getUTCFullYear()}-Q${Math.floor(now.getUTCMonth() / 3)}`;
  if (lastRefresh90Date === quarterKey) return false;

  // 1st of Jan(0), Apr(3), Jul(6), Oct(9) at 04:00 UTC
  const quarterMonths = [0, 3, 6, 9];
  if (
    quarterMonths.includes(now.getUTCMonth()) &&
    now.getUTCDate() === 1 &&
    now.getUTCHours() === 4 &&
    now.getUTCMinutes() === 0
  ) {
    return true;
  }
  return false;
}

async function runWithTimeout(fn, timeoutMs, label) {
  return new Promise((resolve) => {
    const timeout = setTimeout(() => {
      console.error(`[cron] ${label} timed out after ${timeoutMs / 1000}s`);
      resolve();
    }, timeoutMs);

    fn()
      .then(() => {
        clearTimeout(timeout);
        resolve();
      })
      .catch((err) => {
        clearTimeout(timeout);
        console.error(`[cron] ${label} error:`, err.message);
        resolve();
      });
  });
}

function startCron() {
  console.log(`[cron] Worker started. AUTO_GEN_ENABLED: ${AUTO_GEN_ENABLED}`);
  console.log(`[cron] Schedules:`);
  console.log(`  - Article generation: Mon-Fri 12:00 UTC`);
  console.log(`  - 30-day refresh: 1st of month 03:00 UTC (25 articles)`);
  console.log(`  - 90-day refresh: Quarterly 04:00 UTC (20 articles)`);

  setInterval(() => {
    const now = new Date();

    // Article generation
    if (shouldGenerate(now)) {
      console.log(`[cron] Triggering article generation at ${now.toISOString()}`);
      lastGenDate = now.toISOString().slice(0, 10);
      runWithTimeout(
        () => generateArticle(),
        GEN_TIMEOUT_MS,
        "Article generation"
      );
    }

    // 30-day content refresh
    if (shouldRefresh30(now)) {
      const monthKey = now.toISOString().slice(0, 7);
      console.log(`[cron] Triggering 30-day content refresh at ${now.toISOString()}`);
      lastRefresh30Date = monthKey;
      runWithTimeout(
        () => runContentRefresh("30day"),
        REFRESH_TIMEOUT_MS,
        "30-day refresh"
      );
    }

    // 90-day content refresh
    if (shouldRefresh90(now)) {
      const quarterKey = `${now.getUTCFullYear()}-Q${Math.floor(now.getUTCMonth() / 3)}`;
      console.log(`[cron] Triggering 90-day content refresh at ${now.toISOString()}`);
      lastRefresh90Date = quarterKey;
      runWithTimeout(
        () => runContentRefresh("90day"),
        REFRESH_TIMEOUT_MS,
        "90-day refresh"
      );
    }
  }, CRON_INTERVAL_MS);
}

export { startCron };
