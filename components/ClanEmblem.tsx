"use client";

// Lightweight animated emblem.
// SLOT: swap this for a React Three Fiber 3D badge later (dynamic import, ssr:false)
// once a GLB model exists — keep the component API (an `initial` prop) the same so
// nothing else has to change.
export function ClanEmblem({ initial = "C" }: { initial?: string }) {
  return (
    <div className="relative grid place-items-center">
      <div className="absolute size-72 rounded-full border border-gold/10" />
      <div className="absolute size-64 animate-spin-slow rounded-full border border-gold/20" />
      <div className="animate-float-slow">
        <svg width="180" height="200" viewBox="0 0 180 200" fill="none" aria-hidden="true">
          <defs>
            <linearGradient id="emblem-gold" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#ffd766" />
              <stop offset="1" stopColor="#c6881a" />
            </linearGradient>
          </defs>
          <path
            d="M90 6 L170 34 V104 C170 150 134 180 90 196 C46 180 10 150 10 104 V34 Z"
            fill="#14141c"
            stroke="url(#emblem-gold)"
            strokeWidth="4"
          />
          <path
            d="M90 20 L156 44 V104 C156 142 126 168 90 182 C54 168 24 142 24 104 V44 Z"
            fill="rgba(244,179,36,0.06)"
          />
          <text
            x="90"
            y="122"
            textAnchor="middle"
            fontFamily="var(--font-display)"
            fontSize="72"
            fill="url(#emblem-gold)"
          >
            {initial}
          </text>
        </svg>
      </div>
    </div>
  );
}
