import { clanConfig } from "@/lib/clan-config";
import { ClanEmblem } from "./ClanEmblem";

export function Hero() {
  return (
    <section className="relative mx-auto flex max-w-6xl flex-col items-center gap-10 px-6 pb-16 pt-24 text-center md:pt-32">
      <ClanEmblem initial={clanConfig.name.charAt(0).toUpperCase()} />
      <div className="space-y-4">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-gold">Clan HQ</p>
        <h1 className="font-display text-5xl leading-none text-foreground sm:text-7xl">
          {clanConfig.name}
        </h1>
        <p className="mx-auto max-w-xl text-lg text-muted">{clanConfig.tagline}</p>
      </div>
      <a
        href="#qualify"
        className="rounded-full bg-gold px-8 py-3 font-semibold text-background transition hover:bg-gold-soft"
      >
        Check if you qualify →
      </a>
    </section>
  );
}
