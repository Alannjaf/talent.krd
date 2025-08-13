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
      setServices(services.filter((service) => service.id !== id));
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
              <div className="w-8 h-8 bg-green-600 rounded-full mx-auto mb-4"></div>
              <p className="text-gray-300">Loading your services...</p>
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
          <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-gradient-to-br from-green-300 to-blue-400 opacity-20 animate-float"></div>
          <div
            className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-gradient-to-br from-blue-300 to-purple-400 opacity-20 animate-float"
            style={{ animationDelay: "1s" }}
          ></div>
          <div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-gradient-to-br from-purple-300 to-pink-400 opacity-10 animate-float"
            style={{ animationDelay: "2s" }}
          ></div>
        </div>

        <div className="relative mx-auto max-w-6xl px-4">
          <div className="flex justify-between items-center mb-12 animate-fadeInUp">
            <div>
              <div className="mb-4">
                <span className="inline-block px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-sm font-medium text-gray-300 mb-4">
                  💼 Offer Your Expertise
                </span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
                My <span className="gradient-text">Services</span>
              </h1>
              <p className="text-xl text-gray-300 max-w-2xl">
                Showcase your professional services and connect with clients who need your expertise
              </p>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="group relative px-8 py-4 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold rounded-2xl transition-all duration-300 hover:scale-105 shadow-lg animate-fadeInUp"
              style={{ animationDelay: "0.2s" }}
            >
              <span className="relative z-10">Add New Service</span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
            </button>
          </div>
        </div>
      </section>

      {/* Services Content */}
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

          {services.length === 0 ? (
            <div className="text-center py-20 animate-fadeInUp">
              <div className="glass-card p-12 max-w-2xl mx-auto">
                <div className="text-6xl mb-6">💼</div>
                <h3 className="text-3xl font-bold mb-4">Start Offering Services</h3>
                <p className="text-gray-400 mb-8 text-lg">
                  Create professional service listings to attract clients and grow your business.
                </p>
                <button
                  onClick={() => setShowForm(true)}
                  className="group relative px-8 py-4 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold rounded-2xl transition-all duration-300 hover:scale-105 shadow-lg"
                >
                  <span className="relative z-10">Add Your First Service</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="mb-8 animate-fadeInUp">
                <h2 className="text-3xl font-bold mb-4">
                  Professional <span className="gradient-text">Services</span>
                </h2>
                <p className="text-gray-400">
                  {services.length} service{services.length !== 1 ? "s" : ""} available for clients
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {services.map((service, index) => (
                  <div
                    key={service.id}
                    className="group glass-card p-8 hover-lift animate-fadeInUp"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold mb-2 group-hover:text-green-400 transition-colors">
                          {service.title}
                        </h3>
                        {service.description && (
                          <p className="text-gray-400 mb-4 line-clamp-3">
                            {service.description}
                          </p>
                        )}
                      </div>
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center text-white font-bold text-lg ml-4">
                        💼
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                      {service.price && (
                        <div className="bg-green-900/20 border border-green-700/30 rounded-lg p-3">
                          <div className="text-xs text-green-400 mb-1">Price</div>
                          <div className="font-bold text-green-300">
                            {service.price} {service.currency || "IQD"}
                          </div>
                        </div>
                      )}
                      {service.duration_minutes && (
                        <div className="bg-blue-900/20 border border-blue-700/30 rounded-lg p-3">
                          <div className="text-xs text-blue-400 mb-1">Duration</div>
                          <div className="font-bold text-blue-300">
                            {service.duration_minutes} min
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-3 pt-4 border-t border-gray-700/50">
                      <button
                        onClick={() => {
                          setEditingService(service);
                          setShowForm(true);
                        }}
                        className="flex-1 px-4 py-2 bg-blue-900/30 text-blue-300 rounded-lg hover:bg-blue-900/50 transition-colors font-medium"
                      >
                        Edit Service
                      </button>
                      <button
                        onClick={() => handleDelete(service.id)}
                        className="flex-1 px-4 py-2 bg-red-900/30 text-red-300 rounded-lg hover:bg-red-900/50 transition-colors font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

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
          duration_minutes: form.duration_minutes
            ? parseInt(form.duration_minutes)
            : null,
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
            {service ? "Edit" : "Add"} <span className="gradient-text">Service</span>
          </h2>
          <p className="text-gray-400">
            {service ? "Update your service details" : "Create a new service offering for clients"}
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
              Service Title *
            </label>
            <input
              type="text"
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full rounded-lg border border-gray-600 px-4 py-3 bg-gray-800/50 backdrop-blur-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              placeholder="e.g., Web Development, Logo Design, Consultation"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-300">
              Service Description
            </label>
            <textarea
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              className="w-full rounded-lg border border-gray-600 px-4 py-3 bg-gray-800/50 backdrop-blur-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              rows={4}
              placeholder="Describe what you'll deliver, your process, and what makes your service unique..."
            />
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">
                Price
              </label>
              <input
                type="number"
                step="0.01"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                className="w-full rounded-lg border border-gray-600 px-4 py-3 bg-gray-800/50 backdrop-blur-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                placeholder="0.00"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">
                Currency
              </label>
              <select
                value={form.currency}
                onChange={(e) => setForm({ ...form, currency: e.target.value })}
                className="w-full rounded-lg border border-gray-600 px-4 py-3 bg-gray-800/50 backdrop-blur-sm text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              >
                <option value="IQD">🇮🇶 IQD - Iraqi Dinar</option>
                <option value="USD">🇺🇸 USD - US Dollar</option>
                <option value="EUR">🇪🇺 EUR - Euro</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">
                Duration (minutes)
              </label>
              <input
                type="number"
                value={form.duration_minutes}
                onChange={(e) =>
                  setForm({ ...form, duration_minutes: e.target.value })
                }
                className="w-full rounded-lg border border-gray-600 px-4 py-3 bg-gray-800/50 backdrop-blur-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                placeholder="60"
              />
            </div>
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
              className="flex-2 group relative px-8 py-3 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold rounded-lg transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              <span className="relative z-10">
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </div>
                ) : service ? (
                  "Update Service"
                ) : (
                  "Add Service"
                )}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
