"use client";
import { useState } from "react";
import { fetchTrends, TrendResult } from "@/lib/fetchTrends";

export default function Page() {
  const [keyword, setKeyword] = useState("");
  const [data, setData] = useState<TrendResult | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleAnalyze() {
    setLoading(true);
    const result = await fetchTrends(keyword);
    setData(result);
    setLoading(false);
  }

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-4">Trend Insights</h1>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          className="border p-2 rounded w-64"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Enter keyword (e.g. pizza)"
        />
        <button
          onClick={handleAnalyze}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {loading ? "Analyzing..." : "Analyze"}
        </button>
      </div>

      {data && (
        <div className="bg-gray-100 p-4 rounded">
          <h2 className="text-xl font-semibold mb-2">Key Insights</h2>
          <ul className="list-disc pl-6">
            {data.keyInsights.map((insight, i) => (
              <li key={i}>{insight}</li>
            ))}
          </ul>
        </div>
      )}
    </main>
  );
}
