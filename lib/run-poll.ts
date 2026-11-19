import { getEnv, normalizeTag } from "./env";
import { createCocClient } from "./coc/client";
import { buildSnapshots, nextPollDelayMs } from "./poller";
import { persistSnapshots } from "./snapshots";

/**
 * One poll cycle: fetch clan + members + current war, snapshot, persist.
 * Returns the suggested delay (ms) before the next poll, based on war state.
 */
export async function runPollOnce(): Promise<number> {
  const env = getEnv();
  const clanTag = normalizeTag(env.COC_CLAN_TAG);
  const coc = createCocClient();

  const [clan, members, war] = await Promise.all([
    coc.getClan(clanTag),
    coc.getMembers(clanTag),
    coc.getCurrentWar(clanTag),
  ]);

  await persistSnapshots(buildSnapshots(clanTag, clan, members, war));

  console.log(
    `[poll] ${new Date().toISOString()} ${clan.name} — ${members.length} members, war=${war.state}`,
  );
  return nextPollDelayMs(war.state);
}
