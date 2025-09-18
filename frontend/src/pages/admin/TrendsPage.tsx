// src/pages/admin/TrendsPage.tsx
import React, { useEffect, useState } from "react";
import TrendCard from "../../components/TrendCard";
import { getPendingTrends, approveTrend, rejectTrend, rewriteTrend, type AdminTrendDto } from "../../services/adminApi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function TrendsPage() {
  const [items, setItems] = useState<AdminTrendDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [readyOnly, setReadyOnly] = useState(true);
  const [offset, setOffset] = useState(0);
  const [total, setTotal] = useState(0);
  const limit = 10;
  const [busyId, setBusyId] = useState<number | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await getPendingTrends({ readyOnly, limit, offset });
        setItems(data.items);
        setTotal(data.total);
      } catch (e: any) {
        setError(e?.message || "Erro ao carregar trends pendentes");
      } finally {
        setLoading(false);
      }
    })();
  }, [readyOnly, offset]);

  const handleApprove = async (id: number) => {
    try {
      setBusyId(id);
      await approveTrend(id);
      setItems((prev) => prev.filter((t) => t.id !== id));
      toast.success("Trend aprovada e publicada");
    } catch (e: any) {
      toast.error(e?.message || "Falha ao aprovar");
    } finally {
      setBusyId(null);
    }
  };

  const handleReject = async (id: number) => {
    try {
      setBusyId(id);
      await rejectTrend(id);
      setItems((prev) => prev.filter((t) => t.id !== id));
      toast.success("Trend rejeitada");
    } catch (e: any) {
      toast.error(e?.message || "Falha ao rejeitar");
    } finally {
      setBusyId(null);
    }
  };

  const handleRewrite = async (id: number) => {
    try {
      setBusyId(id);
      const res = await rewriteTrend(id);
      const trend = res?.trend ?? res; // tolera payloads diferentes
      setItems((prev) =>
        prev.map((t) =>
          t.id === id
            ? { ...t, summary: trend.summary ?? t.summary, tags: trend.tags ?? t.tags, thumbnail: trend.thumbnail ?? t.thumbnail }
            : t
        )
      );
      toast.success("Reescrita via IA concluída");
    } catch (e: any) {
      toast.error(e?.message || "Falha na reescrita via IA");
    } finally {
      setBusyId(null);
    }
  };


  return (
    <>
    <div style={{ color: "white" }}>
      <h1>Aprovação de Trends</h1>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
        <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <input type="checkbox" checked={readyOnly} onChange={(e) => { setOffset(0); setReadyOnly(e.target.checked); }} />
          Somente com conteúdo (IA)
        </label>
      </div>
      {loading && <p style={{ color: "#b8c1ec" }}>Carregando...</p>}
      {error && <p style={{ color: "#ff6b6b" }}>{error}</p>}
      <div style={{ display: "grid", gap: 16 }}>
        {items?.map((t) => (
          <div key={t.id} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <TrendCard trend={{ id: t.id, title: t.title, summary: t.summary, tags: safeParseTags(t.tags), likes: 0 }} />
            <div style={{ display: "flex", gap: 8 }}>
              <button disabled={busyId === t.id} onClick={() => handleApprove(t.id)} style={{ opacity: busyId===t.id?0.7:1, background: "#22c55e", color: "#fff", border: "none", padding: "6px 12px", borderRadius: 6, cursor: "pointer" }}>{busyId===t.id?"Aprovando...":"Aprovar"}</button>
              <button disabled={busyId === t.id} onClick={() => handleReject(t.id)} style={{ opacity: busyId===t.id?0.7:1, background: "#ef4444", color: "#fff", border: "none", padding: "6px 12px", borderRadius: 6, cursor: "pointer" }}>{busyId===t.id?"Rejeitando...":"Rejeitar"}</button>
              <button disabled={busyId === t.id} onClick={() => handleRewrite(t.id)} style={{ opacity: busyId===t.id?0.7:1, background: "#f59e0b", color: "#1f2937", border: "none", padding: "6px 12px", borderRadius: 6, cursor: "pointer" }}>{busyId===t.id?"Reescrevendo...":"Reescrever via IA"}</button>
            </div>
          </div>
        )) || []}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 16 }}>
        <button disabled={offset === 0} onClick={() => setOffset((o) => Math.max(0, o - limit))} style={{ padding: "6px 12px", borderRadius: 6 }}>Anterior</button>
        <span style={{ color: "#b8c1ec" }}>{Math.floor(offset / limit) + 1} / {Math.max(1, Math.ceil(total / limit))}</span>
        <button disabled={offset + limit >= total} onClick={() => setOffset((o) => o + limit)} style={{ padding: "6px 12px", borderRadius: 6 }}>Próxima</button>
      </div>
    </div>
    <ToastContainer position="top-right" autoClose={2500} hideProgressBar theme="dark" />
    </>
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
