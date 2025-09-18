// src/pages/Home.tsx
import React from "react";
import { useUser } from "../contexts/UserContext";
import { Link } from "react-router-dom";

export default function Home() {
  const { user } = useUser();

  return (
    <div style={{ color: "white" }}>
      <h1>{user ? `Bem-vindo, ${user.name}` : "Bem-vindo"}</h1>
      {user ? (
        <p>Role: {user.role}</p>
      ) : (
        <div style={{ marginTop: 12 }}>
          <p style={{ color: "#b8c1ec" }}>Faça login para interagir com as trends.</p>
          <Link to="/login" style={{ color: "#3e8cff", fontWeight: 600 }}>Ir para Login</Link>
        </div>
      )}
    </div>
  );
}
