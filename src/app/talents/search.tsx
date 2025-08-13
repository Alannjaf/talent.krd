"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface TalentSearchProps {
  initialSearch?: string;
  initialLocation?: string;
  initialTag?: string;
  locations: string[];
  tags: string[];
}

export default function TalentSearch({
  initialSearch = "",
  initialLocation = "",
  initialTag = "",
  locations,
  tags,
}: TalentSearchProps) {
  const router = useRouter();

  const [search, setSearch] = useState(initialSearch);
  const [location, setLocation] = useState(initialLocation);
  const [tag, setTag] = useState(initialTag);

  const updateURL = () => {
    const params = new URLSearchParams();

    if (search.trim()) params.set("search", search.trim());
    if (location) params.set("location", location);
    if (tag) params.set("tag", tag);

    const queryString = params.toString();
    router.push(`/talents${queryString ? `?${queryString}` : ""}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateURL();
  };

  const clearFilters = () => {
    setSearch("");
    setLocation("");
    setTag("");
    router.push("/talents");
  };

  const hasActiveFilters = search || location || tag;

  return (
    <div className="bg-gray-900 rounded-lg p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid md:grid-cols-3 gap-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium mb-2">Search</label>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Name, skills, bio..."
              className="w-full border rounded-lg px-3 py-2 bg-gray-800"
            />
          </div>

          {/* Location Filter */}
          <div>
            <label className="block text-sm font-medium mb-2">Location</label>
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 bg-gray-800"
            >
              <option value="">All locations</option>
              {locations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>

          {/* Tag Filter */}
          <div>
            <label className="block text-sm font-medium mb-2">Skill</label>
            <select
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 bg-gray-800"
            >
              <option value="">All skills</option>
              {tags.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition"
          >
            Search
          </button>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="border border-gray-300 hover:bg-gray-800 px-6 py-2 rounded-lg font-medium transition"
            >
              Clear filters
            </button>
          )}
        </div>

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2 pt-2">
            {search && (
              <span className="bg-blue-900 text-blue-200 px-3 py-1 rounded-full text-sm">
                Search: &quot;{search}&quot;
              </span>
            )}
            {location && (
              <span className="bg-green-900 text-green-200 px-3 py-1 rounded-full text-sm">
                Location: {location}
              </span>
            )}
            {tag && (
              <span className="bg-purple-900 text-purple-200 px-3 py-1 rounded-full text-sm">
                Skill: {tag}
              </span>
            )}
          </div>
        )}
      </form>
    </div>
  );
}
