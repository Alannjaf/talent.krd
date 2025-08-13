import { neon } from "@neondatabase/serverless";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error("DATABASE_URL is not set. Create app/.env.local first.");
  process.exit(1);
}

const sql = neon(connectionString);

async function main() {
  const user = await sql`
    INSERT INTO users (clerk_id, role, display_name)
    VALUES ('seed-user-1', 'talent', 'Sample Talent')
    ON CONFLICT (clerk_id) DO UPDATE SET display_name = EXCLUDED.display_name
    RETURNING id
  `;

  const userId = user[0].id;

  const profile = await sql`
    INSERT INTO talent_profiles (user_id, headline, bio, location, tags)
    VALUES (${userId}, 'Photographer & Videographer', 'I capture moments that matter.', 'Erbil, IQ', ARRAY['photo','video'])
    ON CONFLICT DO NOTHING
    RETURNING id
  `;

  const profileId = (profile[0] && profile[0].id) || (await sql`SELECT id FROM talent_profiles WHERE user_id = ${userId}`)[0].id;

  await sql`
    INSERT INTO services (profile_id, title, description, price, currency, duration_minutes)
    VALUES (${profileId}, 'Event Coverage', 'Full-day photo and video coverage', 250000.00, 'IQD', 480)
    ON CONFLICT DO NOTHING
  `;

  await sql`
    INSERT INTO portfolio_items (profile_id, media_url, title, description, visibility)
    VALUES (${profileId}, 'https://picsum.photos/seed/portfolio1/800/600', 'Wedding Highlight', 'A highlight video from a recent wedding.', 'public')
    ON CONFLICT DO NOTHING
  `;

  console.log("Seed completed.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
