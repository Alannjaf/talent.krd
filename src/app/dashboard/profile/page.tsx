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
            ? form.tags.split(",").map((t) => t.trim()).filter(Boolean)
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

  if (loading) return <div className="mx-auto max-w-2xl p-6">Loading…</div>;

  return (
    <div className="mx-auto max-w-4xl p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
      </div>
      
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <a
          href="/dashboard/profile"
          className="p-6 border rounded-lg hover:shadow-lg transition-shadow bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800"
        >
          <h3 className="font-semibold text-lg mb-2">Profile</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Edit your basic profile information
          </p>
        </a>
        
        <a
          href="/dashboard/portfolio"
          className="p-6 border rounded-lg hover:shadow-lg transition-shadow"
        >
          <h3 className="font-semibold text-lg mb-2">Portfolio</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Manage your work samples and projects
          </p>
        </a>
        
        <a
          href="/dashboard/services"
          className="p-6 border rounded-lg hover:shadow-lg transition-shadow"
        >
          <h3 className="font-semibold text-lg mb-2">Services</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Create and manage your service offerings
          </p>
        </a>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg border p-6">
        <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>
      {error && <div className="text-red-600 text-sm mb-3">{error}</div>}
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm mb-1">Display name</label>
          <input
            className="w-full rounded border px-3 py-2 bg-transparent"
            value={form.displayName}
            onChange={(e) => setForm({ ...form, displayName: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Headline</label>
          <input
            className="w-full rounded border px-3 py-2 bg-transparent"
            value={form.headline}
            onChange={(e) => setForm({ ...form, headline: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Bio</label>
          <textarea
            className="w-full rounded border px-3 py-2 bg-transparent"
            value={form.bio}
            rows={5}
            onChange={(e) => setForm({ ...form, bio: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Location</label>
          <input
            className="w-full rounded border px-3 py-2 bg-transparent"
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Tags (comma separated)</label>
          <input
            className="w-full rounded border px-3 py-2 bg-transparent"
            value={form.tags}
            onChange={(e) => setForm({ ...form, tags: e.target.value })}
          />
        </div>
        <button
          type="submit"
          disabled={saving}
          className="rounded px-4 py-2 border text-sm hover:bg-black/5 dark:hover:bg-white/10"
        >
          {saving ? "Saving…" : "Save"}
        </button>
      </form>
      </div>
    </div>
  );
}


