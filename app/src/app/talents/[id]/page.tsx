import { sql } from "@/lib/db";
import Image from "next/image";
import BookForm from "./request";

interface Props {
  params: { id: string };
}

export default async function TalentProfilePage({ params }: Props) {
  const id = params.id;

  const [profile] = (await sql`
    SELECT p.id, u.display_name, p.headline, p.bio, p.location, p.tags
    FROM talent_profiles p
    JOIN users u ON u.id = p.user_id
    WHERE p.id = ${id}
  `) as any[];

  if (!profile) {
    return <div className="mx-auto max-w-3xl p-6">Profile not found.</div>;
  }

  const services = (await sql`
    SELECT id, title, description, price, currency, duration_minutes
    FROM services
    WHERE profile_id = ${id}
    ORDER BY created_at DESC
    LIMIT 5
  `) as any[];

  const items = (await sql`
    SELECT id, media_url, title, description
    FROM portfolio_items
    WHERE profile_id = ${id} AND visibility = 'public'
    ORDER BY created_at DESC
    LIMIT 12
  `) as any[];

  return (
    <div className="mx-auto max-w-5xl p-6 space-y-6">
      <header>
        <h1 className="text-2xl font-semibold">{profile.display_name}</h1>
        <p className="text-gray-600 dark:text-gray-400">{profile.headline}</p>
        <div className="text-sm text-gray-500">{profile.location}</div>
        {profile.tags?.length ? (
          <div className="text-xs mt-1">Tags: {profile.tags.join(", ")}</div>
        ) : null}
      </header>

      {services.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold mb-2">Services</h2>
          <ul className="grid sm:grid-cols-2 gap-3">
            {services.map((s) => (
              <li key={s.id} className="border rounded-md p-4">
                <div className="font-medium">{s.title}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">{s.description}</div>
                <div className="text-sm mt-2">
                  {s.price} {s.currency} {s.duration_minutes ? `· ${s.duration_minutes} min` : ""}
                </div>
                <BookForm serviceId={s.id} />
              </li>
            ))}
          </ul>
        </section>
      )}

      {items.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold mb-2">Portfolio</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {items.map((it) => (
              <figure key={it.id} className="rounded-md overflow-hidden border">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={it.media_url} alt={it.title || "Portfolio item"} className="w-full h-48 object-cover" />
                <figcaption className="p-2 text-sm">
                  <div className="font-medium">{it.title || "Untitled"}</div>
                  <div className="text-gray-600 dark:text-gray-400 text-xs">{it.description}</div>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
