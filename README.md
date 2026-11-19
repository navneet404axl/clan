# Clan HQ

A Clash of Clans clan site: a flashy recruiting **front door** + a live **clan tool** (war room, member stats, performance trends, attack coordination). One Next.js app, live data from the official Clash of Clans API, history banked in Postgres.

## Status

- [x] **Phase 0** — scaffold + plumbing (Next.js, Prisma, typed API client, env)
- [x] **Phase 1** — snapshot poller (banks history from day one)
- [ ] Phase 2 — front door · Phase 3 — clan tool core · Phase 4 — trends · Phase 5 — coordination

## Stack

Next.js (App Router) · TypeScript · Tailwind · Prisma + Postgres · pnpm · Vitest.

## Setup

1. **Install**
   ```bash
   pnpm install
   ```
2. **Configure** — copy `.env.example` to `.env` and fill in:
   - `COC_API_TOKEN` — create a key at <https://developer.clashofclans.com> and whitelist it to your server's IP.
   - `COC_CLAN_TAG` — your clan tag, e.g. `#ABC123`.
   - `DATABASE_URL` — a Postgres URL (local, Neon, Supabase, …).
   - `COC_BASE_URL` *(optional)* — point at a fixed-IP proxy to dodge the API's IP whitelist on dynamic-IP hosts.
3. **Create the schema**
   ```bash
   pnpm db:push       # push the Prisma schema to your database
   ```
4. **Run**
   ```bash
   pnpm dev           # the web app
   pnpm poll          # one poll cycle (fetch → snapshot → store)
   pnpm poll:watch    # long-running poller, dynamic cadence
   pnpm test          # unit tests
   ```

## How the poller works (Phase 1)

`pnpm poll` fetches the clan, its members, and the current war, then writes **immutable, timestamped snapshots** (`ClanSnapshot`, `WarSnapshot`, `MemberSnapshot`). It never updates or deletes — trends are computed from the series later. Cadence is war-aware: tight during an active war, relaxed otherwise (see `lib/poller.ts`). A private war log is handled gracefully (`state: "private"`, no crash).

**Deploying the poller:** either run `pnpm poll` on a platform cron (every ~10 min), or run `pnpm poll:watch` as a long-lived process. Both need the API token's IP to be whitelisted — use a fixed-IP host or set `COC_BASE_URL` to a proxy.

> History can't be backfilled (the API only exposes the current war, and CWL data is deleted after each season), so start the poller as early as possible.

## Layout

```
app/            # Next.js routes (front door + dashboards)
lib/            # env, db, and the CoC client + poller logic
  coc/          # API client + types
scripts/        # poll (one-shot) and poll-watch (long-running)
prisma/         # snapshot schema
```
