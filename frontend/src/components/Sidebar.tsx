// src/components/Sidebar.tsx
import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { useUser } from "../contexts/UserContext";

export default function Sidebar() {
  const { user } = useUser();
  const [googleCounts, setGoogleCounts] = useState<{ clicks: number; trends: number }>({ clicks: 0, trends: 0 });

  useEffect(() => {
    // buscar contadores públicos (total)
    const fetchCounts = async () => {
      try {
        const [c1, c2] = await Promise.all([
          fetch("http://localhost:4000/public/google/top-clicks").then((r) => r.json()).catch(() => ({ total: 0 })),
          fetch("http://localhost:4000/public/google/top-trends").then((r) => r.json()).catch(() => ({ total: 0 })),
        ]);
        setGoogleCounts({ clicks: c1?.total || 0, trends: c2?.total || 0 });
      } catch {
        // silencioso
      }
    };
    fetchCounts();
    
    // atualizar a cada 60s
    const interval = setInterval(fetchCounts, 60000);
    return () => clearInterval(interval);
  }, []);

  const youtubeMenu = [
    { label: "Notícias", path: "/youtube/noticias" },
    { label: "Músicas", path: "/youtube/musicas" },
    { label: "Virais", path: "/youtube/virais" },
  ];

  const googleMenu = [
    { label: "Mais clicados", path: "/google/mais-clicados" },
    { label: "Maiores tendências", path: "/google/maiores-tendencias" },
  ];

  const adminMenu = [
    { label: "Aprovação de Trends", path: "/admin/trends" },
    { label: "Usuários", path: "/admin/users" },
    { label: "Configurações", path: "/admin/settings" },
  ];

  return (
    <aside
      style={{
        width: 220,
        background: "#232946",
        color: "#e0e6f7",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        paddingTop: 32,
        boxSizing: "border-box",
        borderRight: "1.5px solid #3e8cff",
      }}
    >
      <nav style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{ padding: "8px 16px", color: "#b8c1ec", fontSize: 12, fontWeight: 700 }}>YouTube</div>
        {youtubeMenu.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            style={({ isActive }) => ({
              padding: "8px 28px",
              borderRadius: "0 24px 24px 0",
              textDecoration: "none",
              color: "#e0e6f7",
              background: isActive ? "#3e8cff33" : "transparent",
              fontWeight: 600,
              transition: "background 0.2s",
            })}
          >
            {item.label}
          </NavLink>
        ))}

        <div style={{ padding: "8px 16px", color: "#b8c1ec", fontSize: 12, fontWeight: 700, marginTop: 8 }}>Google</div>
        {googleMenu.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            style={({ isActive }) => ({
              padding: "8px 28px",
              borderRadius: "0 24px 24px 0",
              textDecoration: "none",
              color: "#e0e6f7",
              background: isActive ? "#3e8cff33" : "transparent",
              fontWeight: 600,
              transition: "background 0.2s",
            })}
          >
            <span>{item.label}</span>
            {item.path.endsWith("mais-clicados") && googleCounts.clicks > 0 && (
              <span style={{ marginLeft: 8, background: "#3e8cff", color: "#fff", borderRadius: 12, padding: "0 8px", fontSize: 12 }}>{googleCounts.clicks}</span>
            )}
            {item.path.endsWith("maiores-tendencias") && googleCounts.trends > 0 && (
              <span style={{ marginLeft: 8, background: "#3e8cff", color: "#fff", borderRadius: 12, padding: "0 8px", fontSize: 12 }}>{googleCounts.trends}</span>
            )}
          </NavLink>
        ))}

        {user?.role === "admin" && (
          <>
            <div style={{ padding: "8px 16px", color: "#b8c1ec", fontSize: 12, fontWeight: 700, marginTop: 8 }}>Admin</div>
            {adminMenu.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                style={({ isActive }) => ({
                  padding: "8px 28px",
                  borderRadius: "0 24px 24px 0",
                  textDecoration: "none",
                  color: "#e0e6f7",
                  background: isActive ? "#3e8cff33" : "transparent",
                  fontWeight: 600,
                  transition: "background 0.2s",
                })}
              >
                {item.label}
              </NavLink>
            ))}
          </>
        )}
      </nav>
    </aside>
  );
}
