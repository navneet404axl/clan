import type { Prisma } from "@prisma/client";
import { prisma } from "./db";
import type { Snapshots } from "./poller";

/** Persist one capture's snapshots in a single transaction (append-only). */
export async function persistSnapshots(s: Snapshots): Promise<void> {
  await prisma.$transaction([
    prisma.clanSnapshot.create({
      data: { ...s.clan, payload: s.clan.payload as Prisma.InputJsonValue },
    }),
    prisma.warSnapshot.create({
      data: {
        ...s.war,
        payload:
          s.war.payload == null
            ? undefined
            : (s.war.payload as Prisma.InputJsonValue),
      },
    }),
    prisma.memberSnapshot.createMany({ data: s.members }),
  ]);
}
