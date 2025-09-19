// src/components/Sidebar.tsx
import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { useUser } from "../contexts/UserContext";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ isOpen = false, onClose }: SidebarProps) {
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
    <aside className={`sidebar-genz ${isOpen ? 'open' : ''}`}>
      {/* Overlay para fechar no mobile */}
      {isOpen && <div className="sidebar-overlay" onClick={onClose}></div>}
      
      <nav className="sidebar-nav">
        {/* YouTube Section */}
        <div className="nav-section">
          <div className="nav-section-title">
            <span className="section-icon">📺</span>
            YouTube
          </div>
          {youtubeMenu.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              <span className="nav-icon">🎬</span>
              {item.label}
            </NavLink>
          ))}
        </div>

        {/* Google Section */}
        <div className="nav-section">
          <div className="nav-section-title">
            <span className="section-icon">🔍</span>
            Google
          </div>
          {googleMenu.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              <span className="nav-icon">
                {item.path.endsWith("mais-clicados") ? "👆" : "📈"}
              </span>
              <span className="nav-label">{item.label}</span>
              {item.path.endsWith("mais-clicados") && googleCounts.clicks > 0 && (
                <span className="nav-badge">{googleCounts.clicks}</span>
              )}
              {item.path.endsWith("maiores-tendencias") && googleCounts.trends > 0 && (
                <span className="nav-badge">{googleCounts.trends}</span>
              )}
            </NavLink>
          ))}
        </div>

        {/* Admin Section */}
        {user?.role === "admin" && (
          <div className="nav-section admin-section">
            <div className="nav-section-title">
              <span className="section-icon">👑</span>
              Admin
            </div>
            {adminMenu.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => `nav-link admin-link ${isActive ? 'active' : ''}`}
              >
                <span className="nav-icon">
                  {item.label.includes("Trends") ? "✅" : 
                   item.label.includes("Usuários") ? "👥" : "⚙️"}
                </span>
                {item.label}
              </NavLink>
            ))}
          </div>
        )}
      </nav>
    </aside>
  );
}
