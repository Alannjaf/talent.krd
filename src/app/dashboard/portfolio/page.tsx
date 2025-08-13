"use client";

import { useEffect, useState } from "react";
import { useUser } from "@stackframe/stack";

type PortfolioItem = {
  id: string;
  media_url: string;
  title: string | null;
  description: string | null;
  visibility: string;
  created_at: string;
};

export default function PortfolioPage() {
  useUser({ or: "redirect" });
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null);

  const loadPortfolio = async () => {
    try {
      const res = await fetch("/api/portfolio");
      const data = await res.json();
      if (!data.ok) throw new Error(data.error || "Failed to load portfolio");
      setItems(data.items || []);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPortfolio();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return;

    try {
      const res = await fetch(`/api/portfolio/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error || "Failed to delete");
      setItems(items.filter((item) => item.id !== id));
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : String(e));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900">
        <div className="flex items-center justify-center h-screen">
          <div className="glass-card p-8 text-center">
            <div className="animate-pulse">
              <div className="w-8 h-8 bg-purple-600 rounded-full mx-auto mb-4"></div>
              <p className="text-gray-300">Loading your portfolio...</p>
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
          <div className="flex justify-between items-center mb-12 animate-fadeInUp">
            <div>
              <div className="mb-4">
                <span className="inline-block px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-sm font-medium text-gray-300 mb-4">
                  🎨 Showcase Your Work
                </span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
                My <span className="gradient-text">Portfolio</span>
              </h1>
              <p className="text-xl text-gray-300 max-w-2xl">
                Showcase your best work and let your creativity speak for itself
              </p>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-2xl transition-all duration-300 hover:scale-105 shadow-lg animate-fadeInUp"
              style={{ animationDelay: "0.2s" }}
            >
              <span className="relative z-10">Add New Item</span>
              <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
            </button>
          </div>
        </div>
      </section>

      {/* Portfolio Content */}
      <section className="py-20 bg-gray-900">
        <div className="mx-auto max-w-6xl px-4">
          {error && (
            <div className="bg-red-900/20 border border-red-700/50 text-red-300 p-4 rounded-lg mb-8 animate-fadeInUp">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            </div>
          )}

          {items.length === 0 ? (
            <div className="text-center py-20 animate-fadeInUp">
              <div className="glass-card p-12 max-w-2xl mx-auto">
                <div className="text-6xl mb-6">🎨</div>
                <h3 className="text-3xl font-bold mb-4">Start Your Portfolio</h3>
                <p className="text-gray-400 mb-8 text-lg">
                  Showcase your best work and impress potential clients with your portfolio.
                </p>
                <button
                  onClick={() => setShowForm(true)}
                  className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-2xl transition-all duration-300 hover:scale-105 shadow-lg"
                >
                  <span className="relative z-10">Add Your First Item</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="mb-8 animate-fadeInUp">
                <h2 className="text-3xl font-bold mb-4">
                  Featured <span className="gradient-text">Work</span>
                </h2>
                <p className="text-gray-400">
                  {items.length} portfolio item{items.length !== 1 ? "s" : ""} showcasing your expertise
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {items.map((item, index) => (
                  <div
                    key={item.id}
                    className="group glass-card overflow-hidden hover-lift animate-fadeInUp"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    {item.media_url && (
                      <div className="aspect-video bg-gray-800/50 relative overflow-hidden">
                        {item.media_url.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={item.media_url}
                            alt={item.title || "Portfolio item"}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <div className="text-center">
                              <div className="text-4xl mb-2">📄</div>
                              <span className="text-gray-400 text-sm">
                                {item.media_url.split("/").pop()}
                              </span>
                            </div>
                          </div>
                        )}
                        
                        {/* Visibility Badge */}
                        <div className="absolute top-4 right-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm ${
                              item.visibility === "public"
                                ? "bg-green-900/30 text-green-300 border border-green-700/50"
                                : "bg-yellow-900/30 text-yellow-300 border border-yellow-700/50"
                            }`}
                          >
                            {item.visibility}
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="p-6">
                      <h3 className="font-bold text-xl mb-2 group-hover:text-purple-400 transition-colors">
                        {item.title || "Untitled Project"}
                      </h3>

                      {item.description && (
                        <p className="text-gray-400 mb-4 line-clamp-3">
                          {item.description}
                        </p>
                      )}

                      <div className="flex gap-3 pt-4 border-t border-gray-700/50">
                        <button
                          onClick={() => {
                            setEditingItem(item);
                            setShowForm(true);
                          }}
                          className="flex-1 px-4 py-2 bg-indigo-900/30 text-indigo-300 rounded-lg hover:bg-indigo-900/50 transition-colors font-medium"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="flex-1 px-4 py-2 bg-red-900/30 text-red-300 rounded-lg hover:bg-red-900/50 transition-colors font-medium"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {showForm && (
        <PortfolioForm
          item={editingItem}
          onClose={() => {
            setShowForm(false);
            setEditingItem(null);
          }}
          onSuccess={() => {
            setShowForm(false);
            setEditingItem(null);
            loadPortfolio();
          }}
        />
      )}
    </div>
  );
}

function PortfolioForm({
  item,
  onClose,
  onSuccess,
}: {
  item: PortfolioItem | null;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    media_url: item?.media_url || "",
    title: item?.title || "",
    description: item?.description || "",
    visibility: item?.visibility || "public",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const url = item ? `/api/portfolio/${item.id}` : "/api/portfolio";
      const method = item ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!data.ok) throw new Error(data.error || "Failed to save");

      onSuccess();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeInUp">
      <div className="glass-card p-8 w-full max-w-2xl relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-700/50 hover:bg-gray-600/50 flex items-center justify-center transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">
            {item ? "Edit" : "Add"} <span className="gradient-text">Portfolio Item</span>
          </h2>
          <p className="text-gray-400">
            {item ? "Update your portfolio item details" : "Add a new piece to showcase your work"}
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

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-300">
              Media URL *
            </label>
            <input
              type="url"
              required
              value={form.media_url}
              onChange={(e) => setForm({ ...form, media_url: e.target.value })}
              className="w-full rounded-lg border border-gray-600 px-4 py-3 bg-gray-800/50 backdrop-blur-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              placeholder="https://example.com/image.jpg"
            />
            <p className="text-xs text-gray-500 mt-2">
              URL to your image, video, or document file
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">
                Project Title
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full rounded-lg border border-gray-600 px-4 py-3 bg-gray-800/50 backdrop-blur-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                placeholder="My awesome project"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">
                Visibility
              </label>
              <select
                value={form.visibility}
                onChange={(e) => setForm({ ...form, visibility: e.target.value })}
                className="w-full rounded-lg border border-gray-600 px-4 py-3 bg-gray-800/50 backdrop-blur-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              >
                <option value="public">🌍 Public - Visible to everyone</option>
                <option value="private">🔒 Private - Only visible to you</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-300">
              Project Description
            </label>
            <textarea
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              className="w-full rounded-lg border border-gray-600 px-4 py-3 bg-gray-800/50 backdrop-blur-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              rows={4}
              placeholder="Describe your project, the technologies used, challenges overcome, and what makes it special..."
            />
          </div>

          <div className="flex gap-4 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700/50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-2 group relative px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-lg transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              <span className="relative z-10">
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </div>
                ) : item ? (
                  "Update Item"
                ) : (
                  "Add to Portfolio"
                )}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
