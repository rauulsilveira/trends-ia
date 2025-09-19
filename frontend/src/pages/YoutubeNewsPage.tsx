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

export default function YoutubeNewsPage() {
  const [items, setItems] = useState<YoutubeTrend[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Mock data para YouTube Notícias
    const mockYoutubeNews: YoutubeTrend[] = [
      {
        id: 1,
        title: "Notícias do Brasil - Últimas atualizações",
        summary: "Acompanhe as principais notícias do Brasil com análises e comentários de especialistas.",
        tags: ["NOTÍCIAS", "BRASIL", "POLÍTICA", "ECONOMIA"],
        likes: 1250,
        thumbnail: "https://via.placeholder.com/400x200/8B5CF6/FFFFFF?text=Notícias+Brasil"
      },
      {
        id: 2,
        title: "Mundo em Foco - Análise Internacional",
        summary: "Cobertura completa dos principais acontecimentos internacionais com perspectiva brasileira.",
        tags: ["INTERNACIONAL", "MUNDO", "ANÁLISE", "NOTÍCIAS"],
        likes: 890,
        thumbnail: "https://via.placeholder.com/400x200/06B6D4/FFFFFF?text=Mundo+em+Foco"
      },
      {
        id: 3,
        title: "Tecnologia e Inovação",
        summary: "As últimas novidades em tecnologia, startups e inovação que impactam o Brasil.",
        tags: ["TECNOLOGIA", "INOVAÇÃO", "STARTUPS", "DIGITAL"],
        likes: 2100,
        thumbnail: "https://via.placeholder.com/400x200/F43F5E/FFFFFF?text=Tecnologia"
      }
    ];

    setTimeout(() => {
      setItems(mockYoutubeNews);
      setLoading(false);
    }, 1000);
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


