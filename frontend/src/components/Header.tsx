import React from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import type { User } from "../contexts/UserContext";

export default function Header() {
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
    <header
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "12px 24px",
        background: "#232946",
        color: "#e0e6f7",
      }}
    >
      <div>
        <span style={{ fontWeight: 600, fontSize: 18 }}>Trendly</span>
      </div>
      

      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        {user ? (
          <>
            <span>{user.name}</span>
            <button
              onClick={toggleRole}
              style={{ padding: "4px 8px", borderRadius: 4, cursor: "pointer" }}
            >
              {user.role === "admin" ? "Admin" : "User"}
            </button>
            <button
              onClick={handleLogout}
              style={{ padding: "4px 8px", borderRadius: 4, cursor: "pointer" }}
            >
              Logout
            </button>
          </>
        ) : (
          <button
            onClick={() => navigate("/login")}
            style={{ padding: "4px 8px", borderRadius: 4, cursor: "pointer" }}
          >
            Login
          </button>
        )}
      </div>
    </header>
  );
}
