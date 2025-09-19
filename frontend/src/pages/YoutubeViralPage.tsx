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

export default function YoutubeViralPage() {
  const [items, setItems] = useState<YoutubeTrend[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Mock data para YouTube Virais
    const mockYoutubeViral: YoutubeTrend[] = [
      {
        id: 1,
        title: "Vídeo que EXPLODIU na internet - 10M views",
        summary: "O vídeo que conquistou milhões de visualizações em poucos dias e se tornou o assunto mais comentado do momento.",
        tags: ["VIRAL", "EXPLOSIVO", "10M", "INTERNET", "SUCESSO"],
        likes: 250000,
        thumbnail: "https://via.placeholder.com/400x200/8B5CF6/FFFFFF?text=Vídeo+EXPLODIU"
      },
      {
        id: 2,
        title: "Tendência do TikTok que virou febre no YouTube",
        summary: "A dança que começou no TikTok e agora domina o YouTube com milhões de pessoas participando do desafio.",
        tags: ["TIKTOK", "DANÇA", "DESAFIO", "TENDÊNCIA", "YOUTUBE"],
        likes: 180000,
        thumbnail: "https://via.placeholder.com/400x200/06B6D4/FFFFFF?text=TikTok+YouTube"
      },
      {
        id: 3,
        title: "Memes que quebraram a internet",
        summary: "Os memes mais engraçados e criativos que se espalharam como fogo na internet e viraram sensação.",
        tags: ["MEMES", "ENGRAÇADO", "CRIATIVO", "SENSAÇÃO", "INTERNET"],
        likes: 320000,
        thumbnail: "https://via.placeholder.com/400x200/F43F5E/FFFFFF?text=Memes+Quebrados"
      }
    ];

    setTimeout(() => {
      setItems(mockYoutubeViral);
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <div style={{ color: "white" }}>
      <h1>YouTube / Virais</h1>
      {loading && <p style={{ color: "#b8c1ec" }}>Carregando...</p>}
      {error && <p style={{ color: "#ff6b6b" }}>{error}</p>}
      {!loading && !error && items.length === 0 && (
        <p style={{ color: "#b8c1ec" }}>Nenhum vídeo viral encontrado.</p>
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


