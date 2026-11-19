export function StatCard({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="rounded-xl border border-border bg-surface/60 px-5 py-4 text-center backdrop-blur">
      <div className={`font-display text-3xl ${accent ? "text-gold" : "text-foreground"}`}>
        {value}
      </div>
      <div className="mt-1 text-xs uppercase tracking-wider text-muted">{label}</div>
    </div>
  );
}
