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

    allLocations = [
      ...new Set(filtersData.map((d) => d.location).filter(Boolean)),
    ] as string[];
    allTags = [
      ...new Set(filtersData.map((d) => d.tag).filter(Boolean)),
    ] as string[];
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
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 py-20">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-gradient-to-br from-purple-300 to-indigo-400 opacity-20 animate-float"></div>
          <div
            className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-gradient-to-br from-pink-300 to-purple-400 opacity-20 animate-float"
            style={{ animationDelay: "1s" }}
          ></div>
          <div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-gradient-to-br from-blue-300 to-cyan-400 opacity-10 animate-float"
            style={{ animationDelay: "2s" }}
          ></div>
        </div>

        <div className="relative mx-auto max-w-6xl px-4">
          <div className="text-center mb-12 animate-fadeInUp">
            <div className="mb-6">
              <span className="inline-block px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-sm font-medium text-gray-300 mb-4">
                🎯 Find Your Perfect Match
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Discover <span className="gradient-text">Talented Creators</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Find skilled professionals across Kurdistan for your next project
            </p>
          </div>

          {/* Search Section */}
          <div className="glass-card p-8 mb-8 animate-fadeInUp" style={{ animationDelay: "0.2s" }}>
            <TalentSearch
              initialSearch={search}
              initialLocation={location}
              initialTag={tag}
              locations={allLocations}
              tags={allTags}
            />
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="py-20 bg-gray-900">
        <div className="mx-auto max-w-6xl px-4">
          {/* Results Header */}
          <div className="mb-8 animate-fadeInUp">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-3xl font-bold">
                Available <span className="gradient-text">Talents</span>
              </h2>
              <span className="px-4 py-2 rounded-full bg-indigo-900/30 border border-indigo-700/50 text-indigo-300 text-sm font-medium">
                {talents.length} talent{talents.length !== 1 ? "s" : ""} found
                {search && ` for "${search}"`}
                {location && ` in "${location}"`}
                {tag && ` with tag "${tag}"`}
              </span>
            </div>
          </div>

          {talents.length === 0 ? (
            <div className="text-center py-20 animate-fadeInUp">
              <div className="glass-card p-12 max-w-2xl mx-auto">
                <div className="text-6xl mb-6">🔍</div>
                <h3 className="text-2xl font-bold mb-4">No Talents Found</h3>
                <p className="text-gray-400 mb-6">
                  No talents found matching your criteria.
                </p>
                <p className="text-sm text-gray-500">
                  Try adjusting your search filters or explore different keywords.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {talents.map((t, index) => (
                <Link
                  key={t.id}
                  href={`/talents/${t.id}`}
                  className="group glass-card p-6 hover-lift animate-fadeInUp"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-bold text-lg mr-4">
                      {(t.display_name || "U").charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg group-hover:text-indigo-400 transition-colors">
                        {t.display_name || "Unnamed Talent"}
                      </h3>
                      <p className="text-sm text-gray-400">
                        {t.headline || "Professional"}
                      </p>
                    </div>
                  </div>

                  {t.location && (
                    <div className="flex items-center text-sm text-gray-400 mb-3">
                      <svg
                        className="w-4 h-4 mr-2"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {t.location}
                    </div>
                  )}

                  {t.tags && t.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {t.tags.slice(0, 3).map((tag, tagIndex) => (
                        <span
                          key={tagIndex}
                          className="px-3 py-1 bg-gradient-to-r from-indigo-900 to-purple-900 text-indigo-300 rounded-full text-xs font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                      {t.tags.length > 3 && (
                        <span className="px-3 py-1 bg-gray-800 text-gray-400 rounded-full text-xs">
                          +{t.tags.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
