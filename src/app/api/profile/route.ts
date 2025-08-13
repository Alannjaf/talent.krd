import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { sql } from "@/lib/db";
import { getOrCreateUserByClerkId, getOrCreateTalentProfile } from "@/lib/users";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    const { id: appUserId } = await getOrCreateUserByClerkId(userId, "talent");
    const { id: profileId } = await getOrCreateTalentProfile(appUserId);
    const rows = (await sql`
      SELECT u.display_name, p.headline, p.bio, p.location, p.tags
      FROM talent_profiles p JOIN users u ON u.id = p.user_id
      WHERE p.id = ${profileId}
    `) as Array<{ display_name: string | null; headline: string | null; bio: string | null; location: string | null; tags: string[] | null }>;
    return NextResponse.json({ ok: true, profile: rows[0] || null });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { displayName, headline, bio, location, tags } = body || {};
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    const { id: appUserId } = await getOrCreateUserByClerkId(userId, "talent");
    const { id: profileId } = await getOrCreateTalentProfile(appUserId);

    if (typeof displayName === "string") {
      await sql`UPDATE users SET display_name = ${displayName} WHERE id = ${appUserId}`;
    }
    await sql`
      UPDATE talent_profiles
      SET headline = ${headline || null},
          bio = ${bio || null},
          location = ${location || null},
          tags = ${Array.isArray(tags) ? tags : null}
      WHERE id = ${profileId}
    `;
    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}


