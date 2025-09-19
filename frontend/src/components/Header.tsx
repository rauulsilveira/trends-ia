import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import type { User } from "../contexts/UserContext";

interface HeaderProps {
  onToggleSidebar?: () => void;
}

export default function Header({ onToggleSidebar }: HeaderProps) {
  const { user, setUser } = useUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
    navigate("/");
  };

  const toggleRole = () => {
    if (!user || !setUser) return;
    const updatedUser: User = {
      ...user,
      role: user.role === "admin" ? "user" : "admin", // TS entende UserRole
    };
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  return (
    <header className="header-genz">
      <div className="header-left">
        {/* Hamburger Menu Button */}
        <button
          className="hamburger-btn"
          onClick={onToggleSidebar}
          aria-label="Toggle menu"
        >
          <div className="hamburger-line"></div>
          <div className="hamburger-line"></div>
          <div className="hamburger-line"></div>
        </button>
        
        <Link to="/" className="logo-container" style={{ textDecoration: 'none' }}>
          <h1 className="header-logo">Trendly</h1>
          <div className="logo-glow"></div>
        </Link>
      </div>

      <div className="header-right">
        {user ? (
          <>
            <div className="user-info">
              <img 
                src={user.picture} 
                alt={user.name}
                className="user-avatar"
              />
              <div className="user-details">
                <span className="user-name">{user.name}</span>
                <span className={`role-badge ${user.role}`}>
                  {user.role === "admin" ? "Admin" : "User"}
                </span>
              </div>
            </div>
            <button
              onClick={toggleRole}
              className="btn-ghost role-toggle"
            >
              <span className="btn-icon">🔄</span>
              {user.role === "admin" ? "Admin" : "User"}
            </button>
            <button
              onClick={handleLogout}
              className="btn-ghost logout-btn"
            >
              <span className="btn-icon">🚪</span>
              Sair
            </button>
          </>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="btn-primary"
          >
            <span className="btn-icon">👤</span>
            Entrar
          </button>
        )}
      </div>
    </header>
  );
}
