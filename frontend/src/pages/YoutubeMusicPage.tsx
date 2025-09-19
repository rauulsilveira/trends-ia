import React, { useEffect, useState } from "react";
import TrendCard from "../components/TrendCard";

interface YoutubeTrend {
  id: number;
  title: string;
  summary: string;
  tags: string[];
  likes: number;
  thumbnail?: string;
}

export default function YoutubeMusicPage() {
  const [items, setItems] = useState<YoutubeTrend[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Mock data para YouTube Músicas
    const mockYoutubeMusic: YoutubeTrend[] = [
      {
        id: 1,
        title: "Top Hits Brasil 2024 - Playlist Oficial",
        summary: "Os maiores sucessos musicais do Brasil em 2024. Uma seleção especial dos hits que dominaram as paradas.",
        tags: ["MÚSICA", "HITS", "BRASIL", "2024", "PLAYLIST"],
        likes: 15420,
        thumbnail: "https://via.placeholder.com/400x200/8B5CF6/FFFFFF?text=Top+Hits+Brasil"
      },
      {
        id: 2,
        title: "Funk Carioca - Os Maiores Clássicos",
        summary: "Uma viagem pelos maiores clássicos do funk carioca que marcaram gerações e continuam fazendo sucesso.",
        tags: ["FUNK", "CARIOCA", "CLÁSSICOS", "MÚSICA", "BRASIL"],
        likes: 8750,
        thumbnail: "https://via.placeholder.com/400x200/06B6D4/FFFFFF?text=Funk+Carioca"
      },
      {
        id: 3,
        title: "MPB - Música Popular Brasileira",
        summary: "A essência da música brasileira com grandes nomes da MPB e suas canções atemporais.",
        tags: ["MPB", "MÚSICA", "BRASIL", "POPULAR", "CULTURA"],
        likes: 12300,
        thumbnail: "https://via.placeholder.com/400x200/F43F5E/FFFFFF?text=MPB"
      }
    ];

    setTimeout(() => {
      setItems(mockYoutubeMusic);
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <div style={{ color: "white" }}>
      <h1>YouTube / Músicas</h1>
      {loading && <p style={{ color: "#b8c1ec" }}>Carregando...</p>}
      {error && <p style={{ color: "#ff6b6b" }}>{error}</p>}
      {!loading && !error && items.length === 0 && (
        <p style={{ color: "#b8c1ec" }}>Nenhuma música encontrada.</p>
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
                tags: t.tags, 
                likes: t.likes,
                thumbnail: t.thumbnail || undefined 
              }} 
            />
          ))}
        </div>
      )}
    </div>
  );
}


