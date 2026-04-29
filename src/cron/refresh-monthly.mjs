/**
 * Monthly Refresh Cron — quiet-storm
 * Delegates to content-refresh.mjs with "30day" type.
 */
import { runContentRefresh } from "../../scripts/content-refresh.mjs";

export async function refreshMonthly() {
  await runContentRefresh("30day");
}
