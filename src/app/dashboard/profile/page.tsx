"use client";

import { useEffect, useState } from "react";

type Profile = {
  display_name: string | null;
  headline: string | null;
  bio: string | null;
  location: string | null;
  tags: string[] | null;
};

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<{
    displayName: string;
    headline: string;
    bio: string;
    location: string;
    tags: string;
  }>({ displayName: "", headline: "", bio: "", location: "", tags: "" });

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/profile");
        const data = await res.json();
        if (!data.ok) throw new Error(data.error || "Failed to load");
        const p: Profile | null = data.profile;
        if (p) {
          setForm({
            displayName: p.display_name || "",
            headline: p.headline || "",
            bio: p.bio || "",
            location: p.location || "",
            tags: (p.tags || []).join(", "),
          });
        }
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : String(e));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          displayName: form.displayName || null,
          headline: form.headline || null,
          bio: form.bio || null,
          location: form.location || null,
          tags: form.tags
            ? form.tags
                .split(",")
                .map((t) => t.trim())
                .filter(Boolean)
            : null,
        }),
      });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error || "Save failed");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900">
        <div className="flex items-center justify-center h-screen">
          <div className="glass-card p-8 text-center">
            <div className="animate-pulse">
              <div className="w-8 h-8 bg-indigo-600 rounded-full mx-auto mb-4"></div>
              <p className="text-gray-300">Loading your dashboard...</p>
            </div>
          </div>
        </div>
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
                ⚡ Manage Your Presence
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Your <span className="gradient-text">Creative Dashboard</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Manage your profile, showcase your work, and connect with clients
            </p>
          </div>

          {/* Navigation Cards */}
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <a
              href="/dashboard/profile"
              className="group glass-card p-8 hover-lift animate-fadeInUp relative overflow-hidden"
              style={{ animationDelay: "0.1s" }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-bold text-xl mb-4">
                  👤
                </div>
                <h3 className="font-bold text-xl mb-3 group-hover:text-indigo-400 transition-colors">Profile</h3>
                <p className="text-gray-400 group-hover:text-gray-300 transition-colors">
                  Edit your basic profile information and personal details
                </p>
              </div>
            </a>

            <a
              href="/dashboard/portfolio"
              className="group glass-card p-8 hover-lift animate-fadeInUp relative overflow-hidden"
              style={{ animationDelay: "0.2s" }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-pink-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center text-white font-bold text-xl mb-4">
                  🎨
                </div>
                <h3 className="font-bold text-xl mb-3 group-hover:text-purple-400 transition-colors">Portfolio</h3>
                <p className="text-gray-400 group-hover:text-gray-300 transition-colors">
                  Manage your work samples and showcase your projects
                </p>
              </div>
            </a>

            <a
              href="/dashboard/services"
              className="group glass-card p-8 hover-lift animate-fadeInUp relative overflow-hidden"
              style={{ animationDelay: "0.3s" }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-green-600/20 to-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center text-white font-bold text-xl mb-4">
                  💼
                </div>
                <h3 className="font-bold text-xl mb-3 group-hover:text-green-400 transition-colors">Services</h3>
                <p className="text-gray-400 group-hover:text-gray-300 transition-colors">
                  Create and manage your service offerings for clients
                </p>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* Profile Form Section */}
      <section className="py-20 bg-gray-900">
        <div className="mx-auto max-w-4xl px-4">
          <div className="glass-card p-8 animate-fadeInUp">
            <div className="mb-8">
              <h2 className="text-3xl font-bold mb-4">
                Edit <span className="gradient-text">Profile</span>
              </h2>
              <p className="text-gray-400">
                Update your profile information to showcase your talents effectively
              </p>
            </div>

            {error && (
              <div className="bg-red-900/20 border border-red-700/50 text-red-300 p-4 rounded-lg mb-6">
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  {error}
                </div>
              </div>
            )}

            <form onSubmit={onSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">Display Name</label>
                  <input
                    className="w-full rounded-lg border border-gray-600 px-4 py-3 bg-gray-800/50 backdrop-blur-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    placeholder="Your display name"
                    value={form.displayName}
                    onChange={(e) =>
                      setForm({ ...form, displayName: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">Location</label>
                  <input
                    className="w-full rounded-lg border border-gray-600 px-4 py-3 bg-gray-800/50 backdrop-blur-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    placeholder="City, Country"
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">Professional Headline</label>
                <input
                  className="w-full rounded-lg border border-gray-600 px-4 py-3 bg-gray-800/50 backdrop-blur-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  placeholder="e.g., Full-stack Developer & UI/UX Designer"
                  value={form.headline}
                  onChange={(e) => setForm({ ...form, headline: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">Professional Bio</label>
                <textarea
                  className="w-full rounded-lg border border-gray-600 px-4 py-3 bg-gray-800/50 backdrop-blur-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  placeholder="Tell clients about your experience, expertise, and what makes you unique..."
                  value={form.bio}
                  rows={6}
                  onChange={(e) => setForm({ ...form, bio: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">Skills & Tags</label>
                <input
                  className="w-full rounded-lg border border-gray-600 px-4 py-3 bg-gray-800/50 backdrop-blur-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  placeholder="React, Node.js, Design, Photography (comma separated)"
                  value={form.tags}
                  onChange={(e) => setForm({ ...form, tags: e.target.value })}
                />
                <p className="text-sm text-gray-500 mt-2">
                  Add relevant skills and technologies to help clients find you
                </p>
              </div>

              <div className="flex justify-end pt-6">
                <button
                  type="submit"
                  disabled={saving}
                  className="group relative px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-2xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                >
                  <span className="relative z-10">
                    {saving ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Saving...
                      </div>
                    ) : (
                      "Save Profile"
                    )}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
