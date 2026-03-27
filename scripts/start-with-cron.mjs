/**
 * Start With Cron — Spawns web server + cron worker together
 * Start Command for Render: NODE_ENV=production node scripts/start-with-cron.mjs
 */

import { spawn } from "child_process";
import { startCron } from "./cron-worker.mjs";
import { fileURLToPath } from "url";
import path from "path";

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

// Start the cron worker
console.log("[start] Starting cron worker...");
startCron();

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
