// src/pages/Fallback.tsx
import React from "react";
import { useNavigate } from "react-router-dom";

export default function Fallback() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "80vh",
        color: "#fff",
        textAlign: "center",
        gap: "16px",
      }}
    >
      <h2 style={{ color: "#fff" }}>Nada por aqui 😅</h2>
      <p style={{ color: "#b8c1ec" }}>Acesse outra página para continuar navegando.</p>
      <button
        onClick={() => navigate("/")}
        style={{
          padding: "10px 20px",
          fontSize: "16px",
          background: "linear-gradient(90deg, #3e8cff 60%, #2563eb 100%)",
          color: "#fff",
          border: "none",
          borderRadius: 8,
          cursor: "pointer",
          fontWeight: 600,
          transition: "background 0.2s",
        }}
        onMouseEnter={e => (e.currentTarget.style.background = "#2563eb")}
        onMouseLeave={e => (e.currentTarget.style.background = "linear-gradient(90deg, #3e8cff 60%, #2563eb 100%)")}
      >
        Voltar para Trends
      </button>
    </div>
  );
}
