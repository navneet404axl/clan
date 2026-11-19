import { Hero } from "@/components/Hero";
import { ClanPulse } from "@/components/ClanPulse";
import { QualifyCheck } from "@/components/QualifyCheck";

// ISR: statically served, refreshed every 60s so the live pulse stays current
// without sacrificing the instant-load front door.
export const revalidate = 60;

export default function Home() {
  return (
    <>
      <Hero />
      <ClanPulse />
      <QualifyCheck />
      <footer className="mx-auto max-w-6xl px-6 py-10 text-center text-xs text-muted">
        Clan HQ · built with Next.js · live data from the Clash of Clans API
      </footer>
    </>
  );
}
