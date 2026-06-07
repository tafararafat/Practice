"use client";

import { useState } from "react";

const CAT_BREEDS = [
  "Persian cat",
  "Siamese cat",
  "Maine Coon",
  "Bengal cat",
  "Ragdoll cat",
  "British Shorthair",
  "Sphynx cat",
  "Scottish Fold",
  "Abyssinian cat",
  "Norwegian Forest cat",
  "Russian Blue",
  "Birman cat",
  "Burmese cat",
  "Tonkinese cat",
  "Turkish Angora",
];

interface WikiResult {
  title: string;
  extract: string;
  thumbnail?: { source: string };
  content_urls?: { desktop: { page: string } };
}

export default function CatWiki() {
  const [selected, setSelected] = useState<string | null>(null);
  const [data, setData] = useState<WikiResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function fetchBreed(breed: string) {
    setSelected(breed);
    setLoading(true);
    setError(null);
    setData(null);
    try {
      const res = await fetch(
        `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(breed)}`
      );
      if (!res.ok) throw new Error("Could not load article.");
      const json: WikiResult = await res.json();
      setData(json);
    } catch {
      setError("Failed to load information. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-amber-50 font-sans">
      {/* Header */}
      <header className="bg-amber-800 text-white py-6 px-6 shadow-md">
        <div className="max-w-5xl mx-auto flex items-center gap-3">
          <span className="text-4xl">🐱</span>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Cat Wiki</h1>
            <p className="text-amber-200 text-sm mt-0.5">
              Your one-stop encyclopedia for cat breeds
            </p>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-8 flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <aside className="md:w-56 shrink-0">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-amber-700 mb-3">
            Breeds
          </h2>
          <ul className="space-y-1">
            {CAT_BREEDS.map((breed) => (
              <li key={breed}>
                <button
                  onClick={() => fetchBreed(breed)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    selected === breed
                      ? "bg-amber-800 text-white font-medium"
                      : "text-amber-900 hover:bg-amber-200"
                  }`}
                >
                  {breed}
                </button>
              </li>
            ))}
          </ul>
        </aside>

        {/* Main content */}
        <main className="flex-1 min-w-0">
          {!selected && (
            <div className="flex flex-col items-center justify-center h-72 text-center text-amber-700">
              <span className="text-6xl mb-4">🐾</span>
              <p className="text-lg font-medium">Select a breed to learn about it</p>
              <p className="text-sm text-amber-500 mt-1">
                {CAT_BREEDS.length} breeds available
              </p>
            </div>
          )}

          {loading && (
            <div className="flex items-center justify-center h-72 text-amber-700">
              <div className="flex flex-col items-center gap-3">
                <div className="w-10 h-10 border-4 border-amber-300 border-t-amber-800 rounded-full animate-spin" />
                <p className="text-sm">Loading...</p>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-100 text-red-700 rounded-xl p-5 text-sm">
              {error}
            </div>
          )}

          {data && !loading && (
            <article className="bg-white rounded-2xl shadow-sm overflow-hidden">
              {data.thumbnail && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={data.thumbnail.source}
                  alt={data.title}
                  className="w-full max-h-72 object-cover"
                />
              )}
              <div className="p-6">
                <h2 className="text-2xl font-bold text-amber-900 mb-3">
                  {data.title}
                </h2>
                <p className="text-gray-700 leading-relaxed text-base">
                  {data.extract}
                </p>
                {data.content_urls && (
                  <a
                    href={data.content_urls.desktop.page}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-5 text-sm font-medium text-amber-700 hover:text-amber-900 underline underline-offset-2"
                  >
                    Read full article on Wikipedia →
                  </a>
                )}
              </div>
            </article>
          )}
        </main>
      </div>
    </div>
  );
}
