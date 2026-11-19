import { createCocClient } from "@/lib/coc/client";
import { normalizeTag } from "@/lib/env";
import { StatCard } from "./StatCard";

interface Pulse {
  members: number;
  points: number;
  warWins: number;
  warWinStreak: number;
  warLabel: string;
}

function warLabel(state: string, us?: number, them?: number): string {
  switch (state) {
    case "inWar":
      return `War on — ${us ?? 0}★ vs ${them ?? 0}★`;
    case "preparation":
      return "War prep day";
    case "warEnded":
      return `Last war — ${us ?? 0}★ vs ${them ?? 0}★`;
    case "private":
      return "War log is private";
    default:
      return "Not in war";
  }
}

async function getPulse(): Promise<Pulse | null> {
  const tag = normalizeTag(process.env.COC_CLAN_TAG ?? "");
  if (!process.env.COC_API_TOKEN || tag.length < 2) return null;
  try {
    const coc = createCocClient();
    const [clan, war] = await Promise.all([coc.getClan(tag), coc.getCurrentWar(tag)]);
    return {
      members: clan.members,
      points: clan.clanPoints,
      warWins: clan.warWins,
      warWinStreak: clan.warWinStreak,
      warLabel: warLabel(war.state, war.clan?.stars, war.opponent?.stars),
    };
  } catch {
    return null;
  }
}

export async function ClanPulse() {
  const p = await getPulse();

  if (!p) {
    return (
      <section className="mx-auto max-w-6xl px-6 py-10">
        <div className="rounded-xl border border-dashed border-border bg-surface/40 px-6 py-8 text-center text-sm text-muted">
          Live clan stats light up here once{" "}
          <code className="text-gold">COC_API_TOKEN</code> and{" "}
          <code className="text-gold">COC_CLAN_TAG</code> are set.
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-6xl px-6 py-10">
      <div className="mb-4 flex items-center justify-center gap-2 text-sm text-muted">
        <span className="size-2 animate-pulse rounded-full bg-win" />
        {p.warLabel}
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="Members" value={`${p.members}/50`} />
        <StatCard label="War wins" value={p.warWins.toLocaleString()} accent />
        <StatCard label="Win streak" value={String(p.warWinStreak)} accent />
        <StatCard label="Clan points" value={p.points.toLocaleString()} />
      </div>
    </section>
  );
}
