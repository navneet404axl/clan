import { z } from "zod";

const schema = z.object({
  COC_API_TOKEN: z.string().min(1, "COC_API_TOKEN is required"),
  COC_CLAN_TAG: z.string().min(2, "COC_CLAN_TAG is required (e.g. #ABC123)"),
  COC_BASE_URL: z.string().url().default("https://api.clashofclans.com/v1"),
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
});

export type Env = z.infer<typeof schema>;

let cached: Env | null = null;

/** Validate process.env once and return it. Throws a readable error if misconfigured. */
export function getEnv(): Env {
  if (cached) return cached;
  const parsed = schema.safeParse(process.env);
  if (!parsed.success) {
    const issues = parsed.error.issues
      .map((i) => `  - ${i.path.join(".")}: ${i.message}`)
      .join("\n");
    throw new Error(`Invalid environment:\n${issues}`);
  }
  cached = parsed.data;
  return cached;
}

/** Normalize a clan/player tag: trim, uppercase, ensure a leading #. */
export function normalizeTag(tag: string): string {
  const t = tag.trim().toUpperCase();
  return t.startsWith("#") ? t : `#${t}`;
}
