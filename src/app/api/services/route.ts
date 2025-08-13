import { NextResponse } from "next/server";
import { stackServerApp } from "../../../stack";
import { sql } from "@/lib/db";
import { getOrCreateUserByStackId, getOrCreateTalentProfile } from "@/lib/users";

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

    const services = (await sql`
      SELECT id, title, description, price, currency, duration_minutes, created_at
      FROM services
      WHERE profile_id = ${profileId}
      ORDER BY created_at DESC
    `) as Array<{
      id: string;
      title: string;
      description: string | null;
      price: string | null;
      currency: string | null;
      duration_minutes: number | null;
      created_at: string;
    }>;

    return NextResponse.json({ ok: true, services });
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
    const { title, description, price, currency = "IQD", duration_minutes } = body;

    if (!title) {
      return NextResponse.json(
        { ok: false, error: "Title is required" },
        { status: 400 }
      );
    }

    const { id: appUserId } = await getOrCreateUserByStackId(user.id, "talent");
    const { id: profileId } = await getOrCreateTalentProfile(appUserId);

    const created = (await sql`
      INSERT INTO services (profile_id, title, description, price, currency, duration_minutes)
      VALUES (${profileId}, ${title}, ${description || null}, ${price || null}, ${currency}, ${duration_minutes || null})
      RETURNING id
    `) as Array<{ id: string }>;

    return NextResponse.json({ ok: true, id: created[0].id });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
