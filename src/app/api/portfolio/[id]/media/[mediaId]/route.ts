import { NextResponse } from "next/server";
import { stackServerApp } from "../../../../../../stack";
import { sql } from "@/lib/db";
import {
  getOrCreateUserByStackId,
  getOrCreateTalentProfile,
} from "@/lib/users";

// DELETE /api/portfolio/[id]/media/[mediaId] - Delete a specific media file
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string; mediaId: string }> }
) {
  try {
    const user = await stackServerApp.getUser();
    if (!user) {
      return NextResponse.json(
        { ok: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const resolvedParams = await params;
    const { id: appUserId } = await getOrCreateUserByStackId(user.id, "talent");
    const { id: profileId } = await getOrCreateTalentProfile(appUserId);

    // Verify portfolio item belongs to user and media file exists
    const mediaFile = (await sql`
      SELECT m.id 
      FROM media_files m
      JOIN portfolio_items p ON p.id = m.portfolio_item_id
      WHERE m.id = ${resolvedParams.mediaId} 
        AND p.id = ${resolvedParams.id} 
        AND p.profile_id = ${profileId}
    `) as Array<{ id: string }>;

    if (!mediaFile.length) {
      return NextResponse.json(
        { ok: false, error: "Media file not found" },
        { status: 404 }
      );
    }

    await sql`DELETE FROM media_files WHERE id = ${resolvedParams.mediaId}`;

    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
