import React, { useState } from "react";
import { useUser } from "../contexts/UserContext";
import { deleteTrend } from "../services/adminApi";
import { toast } from "react-toastify";

interface AdminTrendCardProps {
  trend: { id: number; title: string; summary: string; tags: string[]; likes: number; thumbnail?: string | null };
  onRemoved?: (id: number) => void;
}

export default function AdminTrendCard({ trend, onRemoved }: AdminTrendCardProps) {
  const { user } = useUser();
  const [showConfirm, setShowConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteTrend(trend.id);
      toast.success("Trend removida com sucesso");
      onRemoved?.(trend.id);
    } catch (e: any) {
      toast.error(e?.message || "Falha ao remover trend");
    } finally {
      setIsDeleting(false);
      setShowConfirm(false);
    }
  };

  const isAdmin = user?.role === "admin";

  return (
    <div style={{ position: "relative" }}>
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

        <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
          <button style={{ background: "#3e8cff", color: "#fff", border: "none", padding: "6px 12px", borderRadius: 6, cursor: "pointer" }}>
            Curtir
          </button>
          <button style={{ background: "#3e8cff", color: "#fff", border: "none", padding: "6px 12px", borderRadius: 6, cursor: "pointer" }}>
            Comentar
          </button>
          <button style={{ background: "#3e8cff", color: "#fff", border: "none", padding: "6px 12px", borderRadius: 6, cursor: "pointer" }}>
            Compartilhar
          </button>
        </div>
      </div>

      {isAdmin && (
        <button
          onClick={() => setShowConfirm(true)}
          style={{
            position: "absolute",
            top: 8,
            right: 8,
            background: "rgba(239, 68, 68, 0.9)",
            color: "#fff",
            border: "none",
            padding: "4px 8px",
            borderRadius: 4,
            cursor: "pointer",
            fontSize: 12,
            fontWeight: 600,
            backdropFilter: "blur(4px)",
          }}
        >
          🗑️
        </button>
      )}

      {showConfirm && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0, 0, 0, 0.8)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
        }}>
          <div style={{
            background: "#232946",
            padding: 24,
            borderRadius: 12,
            border: "1px solid #3e8cff",
            maxWidth: 400,
            textAlign: "center",
          }}>
            <h3 style={{ color: "#e0e6f7", marginBottom: 16 }}>Confirmar Remoção</h3>
            <p style={{ color: "#b8c1ec", marginBottom: 24 }}>
              Tem certeza que deseja remover esta trend? Esta ação não pode ser desfeita.
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
              <button
                onClick={() => setShowConfirm(false)}
                style={{
                  background: "#6b7280",
                  color: "#fff",
                  border: "none",
                  padding: "8px 16px",
                  borderRadius: 6,
                  cursor: "pointer",
                }}
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                style={{
                  background: "#ef4444",
                  color: "#fff",
                  border: "none",
                  padding: "8px 16px",
                  borderRadius: 6,
                  cursor: isDeleting ? "not-allowed" : "pointer",
                  opacity: isDeleting ? 0.7 : 1,
                }}
              >
                {isDeleting ? "Removendo..." : "Remover"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
