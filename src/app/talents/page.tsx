import Link from "next/link";
import { sql } from "@/lib/db";
import TalentSearch from "./search";

type TalentRow = {
  id: string;
  display_name: string | null;
  headline: string | null;
  location: string | null;
  tags: string[] | null;
};

export default async function TalentsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; location?: string; tag?: string }>;
}) {
  const params = await searchParams;
  const { search, location, tag } = params;

  let talents: TalentRow[] = [];
  let allLocations: string[] = [];
  let allTags: string[] = [];

  try {
    // Build dynamic query based on search parameters
    if (search && location && tag) {
      talents = (await sql`
        SELECT p.id, u.display_name, p.headline, p.location, p.tags
        FROM talent_profiles p
        JOIN users u ON u.id = p.user_id
        WHERE (u.display_name ILIKE ${`%${search}%`} OR p.headline ILIKE ${`%${search}%`} OR p.bio ILIKE ${`%${search}%`})
          AND p.location ILIKE ${`%${location}%`}
          AND ${tag} = ANY(p.tags)
        ORDER BY p.created_at DESC LIMIT 50
      `) as TalentRow[];
    } else if (search && location) {
      talents = (await sql`
        SELECT p.id, u.display_name, p.headline, p.location, p.tags
        FROM talent_profiles p
        JOIN users u ON u.id = p.user_id
        WHERE (u.display_name ILIKE ${`%${search}%`} OR p.headline ILIKE ${`%${search}%`} OR p.bio ILIKE ${`%${search}%`})
          AND p.location ILIKE ${`%${location}%`}
        ORDER BY p.created_at DESC LIMIT 50
      `) as TalentRow[];
    } else if (search && tag) {
      talents = (await sql`
        SELECT p.id, u.display_name, p.headline, p.location, p.tags
        FROM talent_profiles p
        JOIN users u ON u.id = p.user_id
        WHERE (u.display_name ILIKE ${`%${search}%`} OR p.headline ILIKE ${`%${search}%`} OR p.bio ILIKE ${`%${search}%`})
          AND ${tag} = ANY(p.tags)
        ORDER BY p.created_at DESC LIMIT 50
      `) as TalentRow[];
    } else if (location && tag) {
      talents = (await sql`
        SELECT p.id, u.display_name, p.headline, p.location, p.tags
        FROM talent_profiles p
        JOIN users u ON u.id = p.user_id
        WHERE p.location ILIKE ${`%${location}%`}
          AND ${tag} = ANY(p.tags)
        ORDER BY p.created_at DESC LIMIT 50
      `) as TalentRow[];
    } else if (search) {
      talents = (await sql`
        SELECT p.id, u.display_name, p.headline, p.location, p.tags
        FROM talent_profiles p
        JOIN users u ON u.id = p.user_id
        WHERE (u.display_name ILIKE ${`%${search}%`} OR p.headline ILIKE ${`%${search}%`} OR p.bio ILIKE ${`%${search}%`})
        ORDER BY p.created_at DESC LIMIT 50
      `) as TalentRow[];
    } else if (location) {
      talents = (await sql`
        SELECT p.id, u.display_name, p.headline, p.location, p.tags
        FROM talent_profiles p
        JOIN users u ON u.id = p.user_id
        WHERE p.location ILIKE ${`%${location}%`}
        ORDER BY p.created_at DESC LIMIT 50
      `) as TalentRow[];
    } else if (tag) {
      talents = (await sql`
        SELECT p.id, u.display_name, p.headline, p.location, p.tags
        FROM talent_profiles p
        JOIN users u ON u.id = p.user_id
        WHERE ${tag} = ANY(p.tags)
        ORDER BY p.created_at DESC LIMIT 50
      `) as TalentRow[];
    } else {
      talents = (await sql`
        SELECT p.id, u.display_name, p.headline, p.location, p.tags
        FROM talent_profiles p
        JOIN users u ON u.id = p.user_id
        ORDER BY p.created_at DESC LIMIT 50
      `) as TalentRow[];
    }

    // Get all unique locations and tags for filters
    const filtersData = (await sql`
      SELECT DISTINCT p.location, unnest(p.tags) as tag
      FROM talent_profiles p
      WHERE p.location IS NOT NULL OR p.tags IS NOT NULL
    `) as Array<{ location: string | null; tag: string | null }>;

    allLocations = [...new Set(filtersData.map(d => d.location).filter(Boolean))] as string[];
    allTags = [...new Set(filtersData.map(d => d.tag).filter(Boolean))] as string[];

  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : String(e);
    return (
      <div className="mx-auto max-w-6xl p-6">
        <h1 className="text-2xl font-bold mb-4">Discover Talents</h1>
        <p className="text-red-600">Failed to load talents: {message}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Discover Talents</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Find skilled professionals across Kurdistan for your next project
        </p>
        
        <TalentSearch 
          initialSearch={search}
          initialLocation={location}
          initialTag={tag}
          locations={allLocations}
          tags={allTags}
        />
      </div>

      {/* Results */}
      <div className="mb-4">
        <p className="text-sm text-gray-500">
          {talents.length} talent{talents.length !== 1 ? 's' : ''} found
          {search && ` for "${search}"`}
          {location && ` in "${location}"`}
          {tag && ` with tag "${tag}"`}
        </p>
      </div>

      {talents.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">No talents found matching your criteria.</p>
          <p className="text-sm text-gray-400">Try adjusting your search filters.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {talents.map((t) => (
            <Link
              key={t.id}
              href={`/talents/${t.id}`}
              className="block p-6 border rounded-lg hover:shadow-lg transition-shadow"
            >
              <h3 className="font-semibold text-lg mb-2">
                {t.display_name || "Unnamed Talent"}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-3">
                {t.headline || "Professional"}
              </p>
              {t.location && (
                <p className="text-sm text-gray-500 mb-2">📍 {t.location}</p>
              )}
              {t.tags && t.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {t.tags.slice(0, 3).map((tag, index) => (
                    <span
                      key={index}
                      className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                  {t.tags.length > 3 && (
                    <span className="text-gray-500 text-xs">+{t.tags.length - 3} more</span>
                  )}
                </div>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
