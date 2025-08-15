import { NextResponse } from "next/server";
import { stackServerApp } from "../../../../../stack";
import { sql } from "@/lib/db";
import {
  getOrCreateUserByStackId,
  getOrCreateTalentProfile,
} from "@/lib/users";

// GET /api/portfolio/[id]/media - Get media files for a portfolio item
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
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

    // Verify portfolio item belongs to user
    const portfolioItem = (await sql`
      SELECT id FROM portfolio_items 
      WHERE id = ${resolvedParams.id} AND profile_id = ${profileId}
    `) as Array<{ id: string }>;

    if (!portfolioItem.length) {
      return NextResponse.json(
        { ok: false, error: "Portfolio item not found" },
        { status: 404 }
      );
    }

    const mediaFiles = (await sql`
      SELECT id, file_name, file_type, file_url, is_link, link_url, created_at
      FROM media_files
      WHERE portfolio_item_id = ${resolvedParams.id}
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

    return NextResponse.json({ ok: true, media: mediaFiles });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

// POST /api/portfolio/[id]/media - Add a media file/link to portfolio item
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await stackServerApp.getUser();
    if (!user) {
      return NextResponse.json(
        { ok: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { url, fileName, fileType, isLink = true } = body;

    if (!url) {
      return NextResponse.json(
        { ok: false, error: "URL is required" },
        { status: 400 }
      );
    }

    const resolvedParams = await params;
    const { id: appUserId } = await getOrCreateUserByStackId(user.id, "talent");
    const { id: profileId } = await getOrCreateTalentProfile(appUserId);

    // Verify portfolio item belongs to user
    const portfolioItem = (await sql`
      SELECT id FROM portfolio_items 
      WHERE id = ${resolvedParams.id} AND profile_id = ${profileId}
    `) as Array<{ id: string }>;

    if (!portfolioItem.length) {
      return NextResponse.json(
        { ok: false, error: "Portfolio item not found" },
        { status: 404 }
      );
    }

    // Extract file info from URL if not provided
    const finalFileName = fileName || url.split("/").pop() || "media-file";
    const finalFileType = fileType || getFileTypeFromUrl(url);

    const created = (await sql`
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
        ${resolvedParams.id}, 
        ${finalFileName}, 
        ${finalFileType}, 
        ${0}, 
        ${isLink ? "" : url}, 
        ${isLink ? "" : url}, 
        ${isLink}, 
        ${isLink ? url : null}
      )
      RETURNING id, file_name, file_type, file_url, is_link, link_url, created_at
    `) as Array<{
      id: string;
      file_name: string;
      file_type: string;
      file_url: string;
      is_link: boolean;
      link_url: string | null;
      created_at: string;
    }>;

    return NextResponse.json({ ok: true, media: created[0] });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

function getFileTypeFromUrl(url: string): string {
  const extension = url.split(".").pop()?.toLowerCase();

  if (!extension) return "unknown";

  const imageTypes = ["jpg", "jpeg", "png", "gif", "webp", "svg"];
  const videoTypes = ["mp4", "avi", "mov", "wmv", "flv", "webm"];
  const audioTypes = ["mp3", "wav", "ogg", "aac"];
  const documentTypes = ["pdf", "doc", "docx", "txt"];

  if (imageTypes.includes(extension)) return "image";
  if (videoTypes.includes(extension)) return "video";
  if (audioTypes.includes(extension)) return "audio";
  if (documentTypes.includes(extension)) return "document";

  return "unknown";
}
