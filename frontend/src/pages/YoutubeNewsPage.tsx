import React, { useEffect, useState } from "react";
import { fetchGoogleTopClicks, type TrendDto } from "../services/trendsApi";
import TrendCard from "../components/TrendCard";

export default function YoutubeNewsPage() {
  const [items, setItems] = useState<TrendDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await fetchGoogleTopClicks(20);
        setItems(data);
      } catch (e: any) {
        setError(e?.message || "Erro ao carregar");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div style={{ color: "white" }}>
      <h1>YouTube / Notícias</h1>
      {loading && <p style={{ color: "#b8c1ec" }}>Carregando...</p>}
      {error && <p style={{ color: "#ff6b6b" }}>{error}</p>}
      {!loading && !error && items.length === 0 && (
        <p style={{ color: "#b8c1ec" }}>Nenhum vídeo encontrado.</p>
      )}
      {items.length > 0 && (
        <div style={{ display: "grid", gap: 16 }}>
          {items.map((t) => (
            <TrendCard 
              key={t.id} 
              trend={{ 
                id: t.id, 
                title: t.title, 
                summary: t.summary, 
                tags: safeParseTags(t.tags), 
                likes: Math.floor(Math.random() * 1000),
                thumbnail: t.thumbnail || undefined 
              }} 
            />
          ))}
        </div>
      )}
    </div>
  );
}

function safeParseTags(tags: string): string[] {
  try {
    const parsed = JSON.parse(tags);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}


