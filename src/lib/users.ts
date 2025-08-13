import { sql } from "@/lib/db";

export async function getOrCreateUserByClerkId(
  clerkId: string,
  defaultRole: "talent" | "customer" | "admin" = "talent"
): Promise<{ id: string }> {
  const existing = (await sql`
    SELECT id FROM users WHERE clerk_id = ${clerkId}
  `) as Array<{ id: string }>;
  if (existing.length) return { id: existing[0].id };

  const inserted = (await sql`
    INSERT INTO users (clerk_id, role)
    VALUES (${clerkId}, ${defaultRole})
    RETURNING id
  `) as Array<{ id: string }>;
  return { id: inserted[0].id };
}

export async function getOrCreateTalentProfile(userId: string): Promise<{ id: string }> {
  const existing = (await sql`
    SELECT id FROM talent_profiles WHERE user_id = ${userId}
  `) as Array<{ id: string }>;
  if (existing.length) return { id: existing[0].id };

  const inserted = (await sql`
    INSERT INTO talent_profiles (user_id)
    VALUES (${userId})
    RETURNING id
  `) as Array<{ id: string }>;
  return { id: inserted[0].id };
}


