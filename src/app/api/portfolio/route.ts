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

    // Fetch media files for each portfolio item
    const itemsWithMedia = await Promise.all(
      items.map(async (item) => {
        const mediaFiles = (await sql`
          SELECT id, file_name, file_type, file_url, is_link, link_url, created_at
          FROM media_files
          WHERE portfolio_item_id = ${item.id}
          ORDER BY created_at ASC
        `) as Array<{
          id: string;
          file_name: string;
          file_type: string;
          file_url: string;
          is_link: boolean;
          link_url: string | null;
          created_at: string;
        }>;

        return {
          ...item,
          media_files: mediaFiles,
        };
      })
    );

    return NextResponse.json({ ok: true, items: itemsWithMedia });
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
    const { title, description, visibility = "public", mediaFiles = [] } = body;

    const { id: appUserId } = await getOrCreateUserByStackId(user.id, "talent");
    const { id: profileId } = await getOrCreateTalentProfile(appUserId);

    // Create the portfolio item
    const created = (await sql`
      INSERT INTO portfolio_items (profile_id, title, description, visibility)
      VALUES (${profileId}, ${title || null}, ${
      description || null
    }, ${visibility})
      RETURNING id
    `) as Array<{ id: string }>;

    const portfolioItemId = created[0].id;

    // Create media files if any were provided
    if (mediaFiles && mediaFiles.length > 0) {
      for (const media of mediaFiles) {
        await sql`
          INSERT INTO media_files (
            portfolio_item_id, 
            file_name, 
            file_type, 
            file_size, 
            file_url, 
            storage_key, 
            is_link, 
            link_url
          )
          VALUES (
            ${portfolioItemId}, 
            ${media.fileName}, 
            ${media.fileType}, 
            ${0}, 
            ${""},
            ${""},
            ${true}, 
            ${media.url}
          )
        `;
      }
    }

    return NextResponse.json({ ok: true, id: portfolioItemId });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
