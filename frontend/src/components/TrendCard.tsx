import React from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";

interface TrendCardProps {
  trend: { id: number; title: string; summary: string; tags: string[]; likes: number; thumbnail?: string | null };
}

export default function TrendCard({ trend }: TrendCardProps) {
  const { user } = useUser();
  const navigate = useNavigate();

  const requireAuth = (action: () => void) => {
    if (!user) {
      navigate("/login", { replace: true });
      return;
    }
    action();
  };

  const handleLike = () => requireAuth(() => {
    // TODO: chamar API de like
  });

  const handleComment = () => requireAuth(() => {
    // TODO: abrir modal/componente de comentário
  });

  const handleShare = () => requireAuth(() => {
    // TODO: lógica de compartilhamento
  });
  return (
    <div style={{ background: "#3e497a33", padding: 16, borderRadius: 12, border: "1.5px solid #3e8cff", color: "#e0e6f7" }}>
      {trend.thumbnail && (
        <img src={trend.thumbnail} alt={trend.title} style={{ width: "100%", maxHeight: 200, objectFit: "cover", borderRadius: 8, marginBottom: 8 }} />
      )}
      <h3>{trend.title}</h3>
      <p>{trend.summary}</p>
      {trend.tags.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 6 }}>
          {trend.tags.map((t) => (
            <span key={t} style={{ background: "#3e8cff33", padding: "2px 8px", borderRadius: 12, fontSize: 12 }}>{t}</span>
          ))}
        </div>
      )}
      <p>Likes: {trend.likes}</p>

      <div style={{ display: "flex", gap: 8 }}>
        <button onClick={handleLike} style={{ background: "#3e8cff", color: "#fff", border: "none", padding: "6px 12px", borderRadius: 6, cursor: "pointer" }}>
          Curtir
        </button>
        <button onClick={handleComment} style={{ background: "#3e8cff", color: "#fff", border: "none", padding: "6px 12px", borderRadius: 6, cursor: "pointer" }}>
          Comentar
        </button>
        <button onClick={handleShare} style={{ background: "#3e8cff", color: "#fff", border: "none", padding: "6px 12px", borderRadius: 6, cursor: "pointer" }}>
          Compartilhar
        </button>
      </div>
    </div>
  );
}
