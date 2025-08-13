import { NextResponse } from "next/server";
import { stackServerApp } from "../../../../stack";
import { sql } from "@/lib/db";
import { getOrCreateUserByStackId, getOrCreateTalentProfile } from "@/lib/users";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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

    // Verify ownership
    const existing = (await sql`
      SELECT id FROM portfolio_items 
      WHERE id = ${id} AND profile_id = ${profileId}
    `) as Array<{ id: string }>;

    if (existing.length === 0) {
      return NextResponse.json(
        { ok: false, error: "Portfolio item not found" },
        { status: 404 }
      );
    }

    await sql`
      UPDATE portfolio_items 
      SET media_url = ${media_url}, 
          title = ${title || null}, 
          description = ${description || null}, 
          visibility = ${visibility}
      WHERE id = ${id}
    `;

    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await stackServerApp.getUser();
    if (!user)
      return NextResponse.json(
        { ok: false, error: "Unauthorized" },
        { status: 401 }
      );

    const { id: appUserId } = await getOrCreateUserByStackId(user.id, "talent");
    const { id: profileId } = await getOrCreateTalentProfile(appUserId);

    // Verify ownership and delete
    const deleted = (await sql`
      DELETE FROM portfolio_items 
      WHERE id = ${id} AND profile_id = ${profileId}
      RETURNING id
    `) as Array<{ id: string }>;

    if (deleted.length === 0) {
      return NextResponse.json(
        { ok: false, error: "Portfolio item not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
