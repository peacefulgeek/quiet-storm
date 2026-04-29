/**
 * Start With Cron — Spawns web server + registers node-cron schedules
 * Start Command for Render: NODE_ENV=production node scripts/start-with-cron.mjs
 *
 * Phase 1 (published < 60): Publisher fires 5x/day every day
 * Phase 2 (published >= 60): Publisher fires 1x/weekday (Mon-Fri 06:00 UTC)
 *
 * Uses DeepSeek V4-Pro via OpenAI SDK. No Anthropic. No FAL.
 * Bunny CDN image library. Hardcoded credentials.
 */

import { spawn } from "child_process";
import { fileURLToPath } from "url";
import path from "path";
import cron from "node-cron";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");

// Start the web server
console.log("[start] Starting web server...");
const server = spawn("node", [path.join(projectRoot, "dist", "index.js")], {
  cwd: projectRoot,
  stdio: "inherit",
  env: { ...process.env, NODE_ENV: "production" },
});

server.on("error", (err) => {
  console.error("[start] Server error:", err.message);
  process.exit(1);
});

server.on("exit", (code) => {
  console.log(`[start] Server exited with code ${code}`);
  process.exit(code || 0);
});

// Register cron schedules
const AUTO_GEN = process.env.AUTO_GEN_ENABLED === "true";
if (!AUTO_GEN) {
  console.log('[cron] AUTO_GEN_ENABLED != "true" — cron disabled');
} else {
  // ─── PUBLISHER: Phase 1 vs Phase 2 ───
  // Phase 1 (published < 60): 5x/day every day (06,10,14,18,22 UTC)
  // Phase 2 (published >= 60): 1x/weekday (Mon-Fri 06:00 UTC)
  // We schedule BOTH but check count at runtime to decide whether to fire.

  // Phase 1 schedule: 5x/day every day
  cron.schedule('0 6,10,14,18,22 * * *', async () => {
    try {
      const { query } = await import("../src/lib/db.mjs");
      const { rows } = await query("SELECT COUNT(*) as cnt FROM articles WHERE status = 'published'");
      const count = parseInt(rows[0].cnt, 10);
      if (count >= 60) {
        console.log(`[cron] Phase 2 active (${count} published). Skipping phase-1 slot.`);
        return;
      }
      console.log(`[cron] Phase 1 publisher (${count} published) ${new Date().toISOString()}`);
      const { generateArticle } = await import("./generate-articles.mjs");
      await generateArticle();
    } catch (e) { console.error("[cron] publisher (phase 1) failed:", e); }
  }, { timezone: "UTC" });

  // Phase 2 schedule: 1x/weekday at 06:00 UTC (only fires when >= 60 published)
  // Note: The 06:00 slot overlaps with Phase 1, so Phase 2 only needs the weekday-only check
  // Actually handled above — when count >= 60, only the 06:00 Mon-Fri fires:
  cron.schedule('0 6 * * 1-5', async () => {
    try {
      const { query } = await import("../src/lib/db.mjs");
      const { rows } = await query("SELECT COUNT(*) as cnt FROM articles WHERE status = 'published'");
      const count = parseInt(rows[0].cnt, 10);
      if (count < 60) return; // Phase 1 handles this
      console.log(`[cron] Phase 2 publisher (${count} published) ${new Date().toISOString()}`);
      const { generateArticle } = await import("./generate-articles.mjs");
      await generateArticle();
    } catch (e) { console.error("[cron] publisher (phase 2) failed:", e); }
  }, { timezone: "UTC" });

  // ─── PRODUCT SPOTLIGHT — Saturday 08:00 UTC ───
  cron.schedule('0 8 * * 6', async () => {
    console.log(`[cron] product-spotlight ${new Date().toISOString()}`);
    try {
      const { generateArticle } = await import("./generate-articles.mjs");
      await generateArticle({ type: "product-spotlight" });
    } catch (e) { console.error("[cron] product-spotlight failed:", e); }
  }, { timezone: "UTC" });

  // ─── MONTHLY CONTENT REFRESH — 1st of month 03:00 UTC ───
  cron.schedule('0 3 1 * *', async () => {
    console.log(`[cron] refresh-monthly ${new Date().toISOString()}`);
    try {
      const { runContentRefresh } = await import("./content-refresh.mjs");
      await runContentRefresh("30day");
    } catch (e) { console.error("[cron] refresh-monthly failed:", e); }
  }, { timezone: "UTC" });

  // ─── QUARTERLY CONTENT REFRESH — Jan/Apr/Jul/Oct 1st at 04:00 UTC ───
  cron.schedule('0 4 1 1,4,7,10 *', async () => {
    console.log(`[cron] refresh-quarterly ${new Date().toISOString()}`);
    try {
      const { runContentRefresh } = await import("./content-refresh.mjs");
      await runContentRefresh("90day");
    } catch (e) { console.error("[cron] refresh-quarterly failed:", e); }
  }, { timezone: "UTC" });

  // ─── ASIN HEALTH CHECK — Sundays 05:00 UTC ───
  cron.schedule('0 5 * * 0', async () => {
    console.log(`[cron] asin-health-check ${new Date().toISOString()}`);
    try {
      const { runProductValidation } = await import("./validate-products.mjs");
      await runProductValidation();
    } catch (e) { console.error("[cron] asin-health-check failed:", e); }
  }, { timezone: "UTC" });

  console.log("[cron] All schedules registered (Phase 1/2 publisher + 4 maintenance crons)");
}

// Handle graceful shutdown
process.on("SIGTERM", () => {
  console.log("[start] SIGTERM received. Shutting down...");
  server.kill("SIGTERM");
  process.exit(0);
});

process.on("SIGINT", () => {
  console.log("[start] SIGINT received. Shutting down...");
  server.kill("SIGINT");
  process.exit(0);
});
