"use client";

import { useState } from "react";

export default function BookForm({ serviceId }: { serviceId: string }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ serviceId }),
      });
      const data = await res.json();
      if (data.ok) {
        setMessage(`Request sent. Booking ID: ${data.id}`);
      } else {
        setMessage(`Failed: ${data.error || "Unknown error"}`);
      }
    } catch (err: any) {
      setMessage(`Error: ${String(err?.message || err)}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="mt-3">
      <button
        type="submit"
        disabled={loading}
        className="text-sm rounded-md px-3 py-1.5 border hover:bg-black/5 dark:hover:bg-white/10"
      >
        {loading ? "Sending..." : "Request booking"}
      </button>
      {message && <div className="text-xs mt-2">{message}</div>}
    </form>
  );
}
