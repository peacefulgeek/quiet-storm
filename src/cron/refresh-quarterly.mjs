/**
 * Quarterly Refresh Cron — quiet-storm
 * Delegates to content-refresh.mjs with "90day" type.
 */
import { runContentRefresh } from "../../scripts/content-refresh.mjs";

export async function refreshQuarterly() {
  await runContentRefresh("90day");
}
