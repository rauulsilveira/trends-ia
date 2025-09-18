// src/pages/Dashboard.tsx
import React from "react";

export default function Dashboard() {
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  return (
    <div
      style={{
        padding: "2rem",
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
      }}
    >
      <h1>Dashboard</h1>
      {user ? (
        <pre
          style={{
            background: "#f4f4f4",
            padding: "1rem",
            borderRadius: "8px",
          }}
        >
          {JSON.stringify(user, null, 2)}
        </pre>
      ) : (
        <p>Nenhum usuário logado</p>
      )}
    </div>
  );
}
