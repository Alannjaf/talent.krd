import Link from "next/link";
import { sql } from "@/lib/db";

export default async function TalentsPage() {
  type TalentRow = {
    id: string;
    display_name: string | null;
    headline: string | null;
    location: string | null;
    tags: string[] | null;
  };
  let talents: TalentRow[] = [];

  try {
    talents = (await sql`
      SELECT p.id, u.display_name, p.headline, p.location, p.tags
      FROM talent_profiles p
      JOIN users u ON u.id = p.user_id
      ORDER BY p.created_at DESC
      LIMIT 50
    `) as TalentRow[];
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : String(e);
    return (
      <div className="mx-auto max-w-4xl p-6">
        <h1 className="text-xl font-semibold mb-2">Talents</h1>
        <p className="text-red-600">Failed to load talents: {message}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl p-6">
      <h1 className="text-xl font-semibold mb-4">Talents</h1>
      {talents.length === 0 ? (
        <p>No talents yet.</p>
      ) : (
        <ul className="space-y-3">
          {talents.map((t) => (
            <li
              key={t.id}
              className="border rounded-md p-4 hover:bg-black/5 dark:hover:bg-white/5 transition"
            >
              <Link href={`/talents/${t.id}`} className="block">
                <div className="font-medium">{t.display_name || "Unnamed"}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {t.headline || "—"}
                </div>
                <div className="text-xs mt-1 text-gray-500">
                  {t.location || ""}
                </div>
                {t.tags && t.tags.length > 0 && (
                  <div className="mt-2 text-xs">Tags: {t.tags.join(", ")}</div>
                )}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
