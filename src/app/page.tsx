import Link from "next/link";
import { sql } from "@/lib/db";

export default async function Home() {
  // Get featured talents for the homepage
  let featuredTalents: Array<{
    id: string;
    display_name: string | null;
    headline: string | null;
    location: string | null;
    tags: string[] | null;
  }> = [];

  try {
    featuredTalents = (await sql`
      SELECT p.id, u.display_name, p.headline, p.location, p.tags
      FROM talent_profiles p
      JOIN users u ON u.id = p.user_id
      ORDER BY p.created_at DESC
      LIMIT 6
    `) as typeof featuredTalents;
  } catch {
    // If DB fails, continue with empty array
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      {/* Hero Section */}
      <section className="text-center py-16">
        <h1 className="text-5xl font-bold mb-4">
          Discover Amazing <span className="text-blue-600">Talents</span>
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
          Connect with skilled professionals across Kurdistan. Find the perfect talent for your project or showcase your own skills to potential clients.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/talents"
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition"
          >
            Browse Talents
          </Link>
          <Link
            href="/handler/sign-up"
            className="border border-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 px-8 py-3 rounded-lg font-medium transition"
          >
            Join as Talent
          </Link>
        </div>
      </section>

      {/* Featured Talents */}
      {featuredTalents.length > 0 && (
        <section className="py-16">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Featured Talents</h2>
            <Link
              href="/talents"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              View all →
            </Link>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredTalents.map((talent) => (
              <Link
                key={talent.id}
                href={`/talents/${talent.id}`}
                className="block p-6 border rounded-lg hover:shadow-lg transition-shadow"
              >
                <h3 className="font-semibold text-lg mb-2">
                  {talent.display_name || "Unnamed Talent"}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-3">
                  {talent.headline || "Professional"}
                </p>
                {talent.location && (
                  <p className="text-sm text-gray-500 mb-2">📍 {talent.location}</p>
                )}
                {talent.tags && talent.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {talent.tags.slice(0, 3).map((tag, index) => (
                      <span
                        key={index}
                        className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                    {talent.tags.length > 3 && (
                      <span className="text-gray-500 text-xs">+{talent.tags.length - 3} more</span>
                    )}
                  </div>
                )}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* How it Works */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900 -mx-4 px-4 rounded-lg">
        <h2 className="text-3xl font-bold text-center mb-12">How it Works</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-blue-100 dark:bg-blue-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🔍</span>
            </div>
            <h3 className="font-semibold text-lg mb-2">Discover</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Browse through talented professionals and find the perfect match for your project
            </p>
          </div>
          <div className="text-center">
            <div className="bg-green-100 dark:bg-green-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">💬</span>
            </div>
            <h3 className="font-semibold text-lg mb-2">Connect</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Request services and communicate directly with talents about your needs
            </p>
          </div>
          <div className="text-center">
            <div className="bg-purple-100 dark:bg-purple-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">✅</span>
            </div>
            <h3 className="font-semibold text-lg mb-2">Get Results</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Work together to bring your vision to life and achieve great results
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
