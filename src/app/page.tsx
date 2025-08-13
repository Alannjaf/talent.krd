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
    <div className="min-h-screen">
      {/* Hero Section with Gradient Background */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 hero-glass">
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

        <div className="relative mx-auto max-w-6xl px-4 py-20 md:py-32">
          <div className="text-center animate-fadeInUp">
            <div className="mb-6">
              <span className="inline-block px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-sm font-medium text-gray-300 mb-4">
                🚀 Discover Amazing Talents in Kurdistan
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Find Your Perfect{" "}
              <span className="gradient-text">Creative Partner</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              Connect with Kurdistan&apos;s most talented creators, developers, and
              professionals. Your next breakthrough project starts here.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/talents"
                className="group relative px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-2xl transition-all duration-300 hover:scale-105 animate-pulse-glow shadow-lg"
              >
                <span className="relative z-10">Explore Talents</span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
              </Link>
              <Link
                href="/handler/sign-up"
                className="glass-card px-8 py-4 font-semibold hover-lift text-gray-300 hover:text-indigo-400 transition-colors duration-300"
              >
                Join as Talent
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-900">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { number: "500+", label: "Talented Creators" },
              { number: "1K+", label: "Projects Completed" },
              { number: "50+", label: "Cities Covered" },
              { number: "98%", label: "Client Satisfaction" },
            ].map((stat, index) => (
              <div
                key={index}
                className="animate-fadeInUp"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="text-3xl md:text-4xl font-bold gradient-text mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Talents */}
      {featuredTalents.length > 0 && (
        <section className="py-20 bg-gradient-to-br from-gray-800 to-gray-900">
          <div className="mx-auto max-w-6xl px-4">
            <div className="text-center mb-16 animate-fadeInUp">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Meet Our <span className="gradient-text">Star Talents</span>
              </h2>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                Discover the most skilled and creative professionals ready to
                bring your vision to life
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredTalents.map((talent, index) => (
                <Link
                  key={talent.id}
                  href={`/talents/${talent.id}`}
                  className="group glass-card p-6 hover-lift animate-fadeInUp"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-bold text-lg mr-4">
                      {(talent.display_name || "U").charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg group-hover:text-indigo-400 transition-colors">
                        {talent.display_name || "Unnamed Talent"}
                      </h3>
                      <p className="text-sm text-gray-400">
                        {talent.headline || "Professional"}
                      </p>
                    </div>
                  </div>

                  {talent.location && (
                    <div className="flex items-center text-sm text-gray-400 mb-3">
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {talent.location}
                    </div>
                  )}

                  {talent.tags && talent.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {talent.tags.slice(0, 3).map((tag, tagIndex) => (
                        <span
                          key={tagIndex}
                          className="px-3 py-1 bg-gradient-to-r from-indigo-900 to-purple-900 text-indigo-300 rounded-full text-xs font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                      {talent.tags.length > 3 && (
                        <span className="px-3 py-1 bg-gray-800 text-gray-400 rounded-full text-xs">
                          +{talent.tags.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                </Link>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link
                href="/talents"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105"
              >
                View All Talents
                <svg
                  className="w-5 h-5 ml-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* How it Works */}
      <section className="py-20 bg-gray-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-indigo-900/20 to-transparent"></div>
        <div className="relative mx-auto max-w-6xl px-4">
          <div className="text-center mb-16 animate-fadeInUp">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              How It <span className="gradient-text">Works</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Simple steps to connect with amazing talents and start your
              project
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                icon: "🔍",
                title: "Discover",
                description:
                  "Browse through our curated list of talented professionals and find the perfect match for your project needs",
                gradient: "from-blue-500 to-cyan-500",
              },
              {
                icon: "💬",
                title: "Connect",
                description:
                  "Reach out directly to talents, discuss your requirements, and get personalized proposals for your project",
                gradient: "from-purple-500 to-pink-500",
              },
              {
                icon: "✨",
                title: "Create Magic",
                description:
                  "Collaborate seamlessly with your chosen talent and watch your vision come to life with exceptional results",
                gradient: "from-green-500 to-emerald-500",
              },
            ].map((step, index) => (
              <div
                key={index}
                className="text-center animate-fadeInUp"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div
                  className={`relative w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br ${step.gradient} flex items-center justify-center shadow-lg`}
                >
                  <span className="text-3xl">{step.icon}</span>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center text-sm font-bold text-indigo-600">
                    {index + 1}
                  </div>
                </div>
                <h3 className="font-bold text-xl mb-4 text-gray-200">
                  {step.title}
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 relative overflow-hidden cta-glass">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-72 h-72 rounded-full bg-white/10 -translate-x-1/2 -translate-y-1/2 animate-float"></div>
          <div
            className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-white/10 translate-x-1/2 translate-y-1/2 animate-float"
            style={{ animationDelay: "1s" }}
          ></div>
        </div>

        <div className="relative mx-auto max-w-4xl px-4 text-center">
          <div className="animate-fadeInUp">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Start Your Project?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Join thousands of satisfied clients who found their perfect
              creative partner on Talent.krd
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/talents"
                className="px-8 py-4 bg-white text-indigo-600 font-semibold rounded-2xl hover:bg-gray-100 transition-all duration-300 hover:scale-105 shadow-lg"
              >
                Find Talents Now
              </Link>
              <Link
                href="/handler/sign-up"
                className="px-8 py-4 border-2 border-white text-white font-semibold rounded-2xl hover:bg-white hover:text-indigo-600 transition-all duration-300"
              >
                Become a Talent
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
