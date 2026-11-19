import { NextResponse } from "next/server";
import { createCocClient, CocApiError } from "@/lib/coc/client";
import { evaluateEligibility } from "@/lib/eligibility";
import { clanConfig } from "@/lib/clan-config";

export async function POST(req: Request) {
  let tag: string;
  try {
    const body = (await req.json()) as { tag?: string };
    tag = (body.tag ?? "").trim();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (tag.length < 2) {
    return NextResponse.json(
      { error: "Enter your player tag (e.g. #ABC123)." },
      { status: 400 },
    );
  }
  if (!process.env.COC_API_TOKEN) {
    return NextResponse.json({ error: "The clan API isn't connected yet." }, { status: 503 });
  }

  try {
    const player = await createCocClient().getPlayer(tag);
    const { eligible, reasons } = evaluateEligibility(player, clanConfig.requirements);
    return NextResponse.json({
      eligible,
      reasons,
      player: {
        name: player.name,
        townHallLevel: player.townHallLevel,
        trophies: player.trophies,
      },
    });
  } catch (e) {
    if (e instanceof CocApiError && e.status === 404) {
      return NextResponse.json({ error: "No player found with that tag." }, { status: 404 });
    }
    return NextResponse.json(
      { error: "Couldn't reach the Clash API. Try again." },
      { status: 502 },
    );
  }
}
