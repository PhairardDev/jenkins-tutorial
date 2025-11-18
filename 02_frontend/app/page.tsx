"use client";

import { useState, useEffect } from "react";

interface Attraction {
  id: number;
  name: string;
  detail?: string;
  latitude: number;
  longitude: number;
  coverimage?: string;
}

export default function Page() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function getAttractions() {
      try {
        const apiHost = process.env.NEXT_PUBLIC_API_URL;
        const url = new URL("/attractions", apiHost).toString();
        const res = await fetch(url);
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setRows(data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }
      } finally {
        setLoading(false);
      }
    }

    getAttractions();
  }, []);

  if (loading) {
    return (
      <main className="container">
        <div className="empty">Loading...</div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="container">
        <div className="empty">Error: {error}</div>
      </main>
    );
  }

  return (
    <main className="container">
      <header className="header">
        <h1 className="title">Attractions List</h1>
        <p className="subtitle">Discover points of interest nearby</p>
      </header>

      {!rows || rows.length === 0 ? (
        <div className="empty">No attractions found.</div>
      ) : (
        <section className="grid" aria-live="polite">
          {rows.map((x: Attraction) => (
            <article key={x.id} className="card">
              {x.coverimage && (
                <div className="media">
                  <img
                    src={x.coverimage}
                    alt={x.name}
                    className="img"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              )}
              <div className="body">
                <h3 className="card-title">{x.name}</h3>
                {x.detail && <p className="detail">{x.detail}</p>}
                <div className="meta">
                  <small>
                    Lat: <span className="code">{x.latitude}</span> · Lng:{" "}
                    <span className="code">{x.longitude}</span>
                  </small>
                </div>
              </div>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}