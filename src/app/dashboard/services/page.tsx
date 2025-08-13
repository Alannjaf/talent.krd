"use client";

import { useEffect, useState } from "react";
import { useUser } from "@stackframe/stack";

type Service = {
  id: string;
  title: string;
  description: string | null;
  price: string | null;
  currency: string | null;
  duration_minutes: number | null;
  created_at: string;
};

export default function ServicesPage() {
  useUser({ or: "redirect" });
  const [loading, setLoading] = useState(true);
  const [services, setServices] = useState<Service[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);

  const loadServices = async () => {
    try {
      const res = await fetch("/api/services");
      const data = await res.json();
      if (!data.ok) throw new Error(data.error || "Failed to load services");
      setServices(data.services || []);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this service?")) return;
    
    try {
      const res = await fetch(`/api/services/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error || "Failed to delete");
      setServices(services.filter(service => service.id !== id));
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : String(e));
    }
  };

  if (loading) return <div className="mx-auto max-w-4xl p-6">Loading services...</div>;

  return (
    <div className="mx-auto max-w-4xl p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Services</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        >
          Add Service
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {services.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">No services yet.</p>
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
          >
            Add Your First Service
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {services.map((service) => (
            <div key={service.id} className="border rounded-lg p-6">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg font-semibold">{service.title}</h3>
                <div className="flex gap-2 text-sm">
                  <button
                    onClick={() => {
                      setEditingService(service);
                      setShowForm(true);
                    }}
                    className="text-blue-600 hover:text-blue-700 px-2 py-1"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(service.id)}
                    className="text-red-600 hover:text-red-700 px-2 py-1"
                  >
                    Delete
                  </button>
                </div>
              </div>

              {service.description && (
                <p className="text-gray-600 dark:text-gray-400 mb-3">
                  {service.description}
                </p>
              )}

              <div className="flex gap-4 text-sm">
                {service.price && (
                  <div>
                    <span className="font-medium">Price:</span> {service.price} {service.currency || "IQD"}
                  </div>
                )}
                {service.duration_minutes && (
                  <div>
                    <span className="font-medium">Duration:</span> {service.duration_minutes} minutes
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <ServiceForm
          service={editingService}
          onClose={() => {
            setShowForm(false);
            setEditingService(null);
          }}
          onSuccess={() => {
            setShowForm(false);
            setEditingService(null);
            loadServices();
          }}
        />
      )}
    </div>
  );
}

function ServiceForm({
  service,
  onClose,
  onSuccess,
}: {
  service: Service | null;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: service?.title || "",
    description: service?.description || "",
    price: service?.price || "",
    currency: service?.currency || "IQD",
    duration_minutes: service?.duration_minutes?.toString() || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const url = service ? `/api/services/${service.id}` : "/api/services";
      const method = service ? "PUT" : "POST";
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          duration_minutes: form.duration_minutes ? parseInt(form.duration_minutes) : null,
        }),
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
          {service ? "Edit Service" : "Add Service"}
        </h2>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-3 py-2 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title *</label>
            <input
              type="text"
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full border rounded px-3 py-2 bg-transparent"
              placeholder="Service title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full border rounded px-3 py-2 bg-transparent"
              rows={3}
              placeholder="Describe your service..."
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">Price</label>
              <input
                type="number"
                step="0.01"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                className="w-full border rounded px-3 py-2 bg-transparent"
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Currency</label>
              <select
                value={form.currency}
                onChange={(e) => setForm({ ...form, currency: e.target.value })}
                className="w-full border rounded px-3 py-2 bg-transparent"
              >
                <option value="IQD">IQD</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Duration (minutes)</label>
            <input
              type="number"
              value={form.duration_minutes}
              onChange={(e) => setForm({ ...form, duration_minutes: e.target.value })}
              className="w-full border rounded px-3 py-2 bg-transparent"
              placeholder="60"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-2 rounded transition"
            >
              {loading ? "Saving..." : service ? "Update" : "Add Service"}
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
