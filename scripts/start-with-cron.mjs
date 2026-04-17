/**
 * Start With Cron — Spawns web server + registers node-cron schedules
 * Start Command for Render: NODE_ENV=production node scripts/start-with-cron.mjs
 *
 * All five crons live in the web service process — no Manus, no external
 * scheduler, no dispatcher. Gated by AUTO_GEN_ENABLED === 'true'.
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
  // 1. Article generation — Mon-Fri 06:00 UTC (5/week)
  cron.schedule('0 6 * * 1-5', async () => {
    console.log(`[cron] generate-article ${new Date().toISOString()}`);
    try {
      const { generateArticle } = await import("./generate-articles.mjs");
      await generateArticle();
    } catch (e) { console.error("[cron] generate-article failed:", e); }
  }, { timezone: "UTC" });

  // 2. Product spotlight — Saturday 08:00 UTC (1/week)
  cron.schedule('0 8 * * 6', async () => {
    console.log(`[cron] product-spotlight ${new Date().toISOString()}`);
    try {
      const { generateArticle } = await import("./generate-articles.mjs");
      await generateArticle({ type: "product-spotlight" });
    } catch (e) { console.error("[cron] product-spotlight failed:", e); }
  }, { timezone: "UTC" });

  // 3. Monthly content refresh — 1st of month 03:00 UTC
  cron.schedule('0 3 1 * *', async () => {
    console.log(`[cron] refresh-monthly ${new Date().toISOString()}`);
    try {
      const { runContentRefresh } = await import("./content-refresh.mjs");
      await runContentRefresh("30day");
    } catch (e) { console.error("[cron] refresh-monthly failed:", e); }
  }, { timezone: "UTC" });

  // 4. Quarterly content refresh — Jan/Apr/Jul/Oct 1st at 04:00 UTC
  cron.schedule('0 4 1 1,4,7,10 *', async () => {
    console.log(`[cron] refresh-quarterly ${new Date().toISOString()}`);
    try {
      const { runContentRefresh } = await import("./content-refresh.mjs");
      await runContentRefresh("90day");
    } catch (e) { console.error("[cron] refresh-quarterly failed:", e); }
  }, { timezone: "UTC" });

  // 5. ASIN health check — Sundays 05:00 UTC
  cron.schedule('0 5 * * 0', async () => {
    console.log(`[cron] asin-health-check ${new Date().toISOString()}`);
    try {
      const { runProductValidation } = await import("./validate-products.mjs");
      await runProductValidation();
    } catch (e) { console.error("[cron] asin-health-check failed:", e); }
  }, { timezone: "UTC" });

  console.log("[cron] All 5 schedules registered (AUTO_GEN_ENABLED=true)");
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
