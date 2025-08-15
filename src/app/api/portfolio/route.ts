import { NextResponse } from "next/server";
import { stackServerApp } from "../../../stack";
import { sql } from "@/lib/db";
import {
  getOrCreateUserByStackId,
  getOrCreateTalentProfile,
} from "@/lib/users";

export async function GET() {
  try {
    const user = await stackServerApp.getUser();
    if (!user)
      return NextResponse.json(
        { ok: false, error: "Unauthorized" },
        { status: 401 }
      );

    const { id: appUserId } = await getOrCreateUserByStackId(user.id, "talent");
    const { id: profileId } = await getOrCreateTalentProfile(appUserId);

    const items = (await sql`
      SELECT id, media_url, title, description, visibility, created_at
      FROM portfolio_items
      WHERE profile_id = ${profileId}
      ORDER BY created_at DESC
    `) as Array<{
      id: string;
      media_url: string | null;
      title: string | null;
      description: string | null;
      visibility: string;
      created_at: string;
    }>;

    return NextResponse.json({ ok: true, items });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await stackServerApp.getUser();
    if (!user)
      return NextResponse.json(
        { ok: false, error: "Unauthorized" },
        { status: 401 }
      );

    const body = await req.json();
    const { media_url, title, description, visibility = "public" } = body;

    if (!media_url) {
      return NextResponse.json(
        { ok: false, error: "Media URL is required" },
        { status: 400 }
      );
    }

    const { id: appUserId } = await getOrCreateUserByStackId(user.id, "talent");
    const { id: profileId } = await getOrCreateTalentProfile(appUserId);

    const created = (await sql`
      INSERT INTO portfolio_items (profile_id, media_url, title, description, visibility)
      VALUES (${profileId}, ${media_url}, ${title || null}, ${
      description || null
    }, ${visibility})
      RETURNING id
    `) as Array<{ id: string }>;

    return NextResponse.json({ ok: true, id: created[0].id });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
