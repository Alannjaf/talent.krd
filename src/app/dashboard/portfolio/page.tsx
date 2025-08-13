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
      setItems(items.filter(item => item.id !== id));
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : String(e));
    }
  };

  if (loading) return <div className="mx-auto max-w-4xl p-6">Loading portfolio...</div>;

  return (
    <div className="mx-auto max-w-4xl p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Portfolio</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        >
          Add Item
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {items.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">No portfolio items yet.</p>
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
          >
            Add Your First Item
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <div key={item.id} className="border rounded-lg overflow-hidden">
              {item.media_url && (
                <div className="aspect-video bg-gray-100 dark:bg-gray-800">
                  {item.media_url.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.media_url}
                      alt={item.title || "Portfolio item"}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-gray-400">📄 {item.media_url.split('/').pop()}</span>
                    </div>
                  )}
                </div>
              )}
              
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium">{item.title || "Untitled"}</h3>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      item.visibility === "public"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {item.visibility}
                  </span>
                </div>
                
                {item.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    {item.description}
                  </p>
                )}
                
                <div className="flex gap-2 text-sm">
                  <button
                    onClick={() => {
                      setEditingItem(item);
                      setShowForm(true);
                    }}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <h2 className="text-lg font-bold mb-4">
          {item ? "Edit Portfolio Item" : "Add Portfolio Item"}
        </h2>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-3 py-2 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Media URL *</label>
            <input
              type="url"
              required
              value={form.media_url}
              onChange={(e) => setForm({ ...form, media_url: e.target.value })}
              className="w-full border rounded px-3 py-2 bg-transparent"
              placeholder="https://example.com/image.jpg"
            />
            <p className="text-xs text-gray-500 mt-1">
              URL to your image, video, or document
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full border rounded px-3 py-2 bg-transparent"
              placeholder="Project title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full border rounded px-3 py-2 bg-transparent"
              rows={3}
              placeholder="Describe this work..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Visibility</label>
            <select
              value={form.visibility}
              onChange={(e) => setForm({ ...form, visibility: e.target.value })}
              className="w-full border rounded px-3 py-2 bg-transparent"
            >
              <option value="public">Public</option>
              <option value="private">Private</option>
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-2 rounded transition"
            >
              {loading ? "Saving..." : item ? "Update" : "Add Item"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
