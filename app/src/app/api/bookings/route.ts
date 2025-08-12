import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { serviceId, scheduleStart, scheduleEnd, priceAgreed } = body || {};
    if (!serviceId) {
      return NextResponse.json({ ok: false, error: "serviceId is required" }, { status: 400 });
    }

    // Resolve customer id
    let customerId: string | null = null;
    try {
      const { userId } = auth();
      if (userId) {
        const rows = await sql`SELECT id FROM users WHERE clerk_id = ${userId}` as any[];
        if (rows.length) customerId = rows[0].id;
        else {
          const inserted = await sql`INSERT INTO users (clerk_id, role) VALUES (${userId}, 'customer') RETURNING id` as any[];
          customerId = inserted[0].id;
        }
      }
    } catch {
      // ignore Clerk when not configured
    }

    if (!customerId) {
      // fallback seed customer for testing
      const upsert = await sql`
        INSERT INTO users (clerk_id, role, display_name)
        VALUES ('seed-customer-1', 'customer', 'Sample Customer')
        ON CONFLICT (clerk_id) DO UPDATE SET display_name = EXCLUDED.display_name
        RETURNING id
      ` as any[];
      customerId = upsert[0].id;
    }

    const created = await sql`
      INSERT INTO bookings (service_id, customer_id, status, schedule_start, schedule_end, price_agreed)
      VALUES (${serviceId}, ${customerId}, 'requested', ${scheduleStart || null}, ${scheduleEnd || null}, ${priceAgreed || null})
      RETURNING id
    ` as any[];

    return NextResponse.json({ ok: true, id: created[0].id });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: String(e?.message || e) }, { status: 500 });
  }
}
