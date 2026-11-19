// Long-running poller with dynamic cadence: `pnpm poll:watch`.
// Re-schedules itself based on war state (tight during wars, relaxed otherwise).
import { runPollOnce } from "../lib/run-poll";

const ERROR_BACKOFF_MS = 15 * 60_000;

async function loop(): Promise<void> {
  let delay: number;
  try {
    delay = await runPollOnce();
  } catch (e) {
    console.error("[poll-watch] cycle failed:", e instanceof Error ? e.message : e);
    delay = ERROR_BACKOFF_MS;
  }
  console.log(`[poll-watch] next poll in ${Math.round(delay / 60000)} min`);
  setTimeout(() => void loop(), delay);
}

console.log("[poll-watch] starting dynamic poller…");
void loop();
