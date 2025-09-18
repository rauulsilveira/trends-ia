// src/pages/admin/AdminTrends.tsx
import React, { useEffect, useState } from "react";

interface AdminTrendsProps {
  user: any;
  setUser: (u: any) => void;
}

interface Trend {
  id: number;
  title: string;
  summary: string;
  tags: string[];
  date: string;
  likes: number;
  thumbnail?: string;
}

const mockTrends: Trend[] = [
  { id: 1, title: "Trend 1", summary: "Resumo da trend 1", tags: ["Tech"], date: "2025-09-12", likes: 120 },
  { id: 2, title: "Trend 2", summary: "Resumo da trend 2", tags: ["News"], date: "2025-09-11", likes: 85 },
];

export default function AdminTrends({ user, setUser }: AdminTrendsProps) {
  const [trends, setTrends] = useState<Trend[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setTrends(mockTrends);
    setLoading(false);
  }, []);

  return (
    <div>
      <h3 style={{ color: "#fff", marginBottom: 16 }}>Trends (Admin)</h3>

      {loading ? (
        <p style={{ color: "#b8c1ec" }}>Carregando...</p>
      ) : trends.length === 0 ? (
        <p style={{ color: "#b8c1ec" }}>Nenhuma trend encontrada</p>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 24 }}>
          {trends.map((t) => (
            <div key={t.id} style={{ background: "#3e497a", padding: 16, borderRadius: 12, color: "#fff" }}>
              <h4 style={{ marginTop: 0 }}>{t.title}</h4>
              <p>{t.summary}</p>
              <p>Tags: {t.tags.join(", ")}</p>
              <p>Likes: {t.likes}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
