"use client";

import { useState, type FormEvent } from "react";

interface Result {
  eligible: boolean;
  reasons: string[];
  player?: { name: string; townHallLevel: number; trophies: number };
}

export function QualifyCheck() {
  const [tag, setTag] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Result | null>(null);

  async function check(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setResult(null);
    setLoading(true);
    try {
      const res = await fetch("/api/qualify", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ tag }),
      });
      const data = (await res.json()) as Result & { error?: string };
      if (!res.ok) throw new Error(data.error ?? "Something went wrong.");
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section id="qualify" className="mx-auto max-w-xl px-6 py-16">
      <h2 className="text-center font-display text-3xl text-foreground">Do you qualify?</h2>
      <p className="mt-2 text-center text-muted">
        Drop your player tag and find out instantly.
      </p>

      <form onSubmit={check} className="mt-6 flex gap-2">
        <input
          value={tag}
          onChange={(e) => setTag(e.target.value)}
          placeholder="#ABC123"
          aria-label="Player tag"
          className="flex-1 rounded-lg border border-border bg-surface px-4 py-3 text-foreground outline-none focus:border-gold"
        />
        <button
          type="submit"
          disabled={loading || tag.trim().length < 2}
          className="rounded-lg bg-gold px-5 py-3 font-semibold text-background transition hover:bg-gold-soft disabled:opacity-50"
        >
          {loading ? "Checking…" : "Check"}
        </button>
      </form>

      {error && <p className="mt-4 text-center text-loss">{error}</p>}

      {result && (
        <div
          className={`mt-6 rounded-xl border px-6 py-5 ${
            result.eligible ? "border-win/40 bg-win/5" : "border-loss/40 bg-loss/5"
          }`}
        >
          <p className={`font-display text-xl ${result.eligible ? "text-win" : "text-loss"}`}>
            {result.player?.name ? `${result.player.name} — ` : ""}
            {result.eligible ? "You're in! 🎉" : "Not quite yet"}
          </p>
          {result.reasons.length > 0 && (
            <ul className="mt-2 list-inside list-disc text-sm text-muted">
              {result.reasons.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          )}
        </div>
      )}
    </section>
  );
}
