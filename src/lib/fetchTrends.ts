// Data format returned from the Flask backend
export interface TrendResult {
  keyword: string;
  marketData: {
    date: string;
    [key: string]: number | string;
  }[];
  keyInsights: string[];
  competitorAnalysis?: string[];
  sources?: { url: string; title: string; relevance: number }[];
}

export async function fetchTrends(keyword: string): Promise<TrendResult | null> {
    const baseURL = process.env.NEXT_PUBLIC_FLASK_URL || 'http://127.0.0.1:8000';
  try {
    // Makes a call like so http://127.0.0.1:8000/analyze?keyword=pizza
    const res = await fetch(`${baseURL}/analyze?keyword=${encodeURIComponent(keyword)}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) {
      throw new Error(`Flask API returned status ${res.status}`);
    }

    /*
        Data returned as shown
        {
            "keyword": "pizza",
            "marketData": [{ "date": "2020-11-08", "pizza": 74, ... }],
            "keyInsights": ["pizza placeholder insight 1", "pizza placeholder insight 2"],
            "competitorAnalysis": [...],
            "sources": [...]
        }
    */
    const data = await res.json();
    return data as TrendResult;
  } catch (error) {
    console.error("❌ Error fetching from Flask backend:", error);
    return null;
  }
}
