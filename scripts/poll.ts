// One-shot poll: `pnpm poll`. Use this with a platform cron (e.g. every 10 min),
// or run scripts/poll-watch.ts for a self-scheduling long-running poller.
import { runPollOnce } from "../lib/run-poll";

runPollOnce()
  .then((delay) => {
    console.log(`[poll] done. suggested next poll in ${Math.round(delay / 60000)} min.`);
    process.exit(0);
  })
  .catch((err) => {
    console.error("[poll] failed:", err instanceof Error ? err.message : err);
    process.exit(1);
  });
