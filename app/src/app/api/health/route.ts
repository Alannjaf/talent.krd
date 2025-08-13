import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function GET() {
  try {
    const rows = (await sql`select now() as now`) as Array<{ now: string }>;
    const dbTime =
      rows && Array.isArray(rows) && rows.length ? rows[0].now : null;
    return NextResponse.json({ ok: true, dbTime });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
