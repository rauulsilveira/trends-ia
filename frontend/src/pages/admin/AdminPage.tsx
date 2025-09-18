// src/pages/admin/AdminPage.tsx
import React from "react";
import { NavLink, Outlet } from "react-router-dom";

interface AdminPageProps {
  user: any;
  setUser: (u: any) => void;
}

export default function AdminPage({ user }: AdminPageProps) {
  if (!user || user.role !== "admin") {
    return <div style={{ padding: 32, color: "#fff" }}>Acesso negado</div>;
  }

  const linkStyle = (isActive: boolean) => ({
    padding: "8px 16px",
    borderRadius: 8,
    textDecoration: "none",
    color: isActive ? "#fff" : "#b8c1ec",
    background: isActive ? "#3e8cff" : "transparent",
    fontWeight: 600,
  });

  return (
    <div style={{ padding: 24, color: "#fff" }}>
      <h2 style={{ marginTop: 0 }}>Admin Dashboard</h2>

      <nav style={{ marginBottom: 20, display: "flex", gap: 12 }}>
        <NavLink to="users" style={({ isActive }) => linkStyle(isActive)}>
          Usuários
        </NavLink>

        <NavLink to="trends" style={({ isActive }) => linkStyle(isActive)}>
          Aprovação de Trends
        </NavLink>

        <NavLink to="config" style={({ isActive }) => linkStyle(isActive)}>
          Configurações
        </NavLink>
      </nav>

      {/* Area onde as sub-rotas serão renderizadas */}
      <div>
        <Outlet />
      </div>
    </div>
  );
}
