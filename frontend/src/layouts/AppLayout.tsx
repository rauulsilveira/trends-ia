// src/layouts/AppLayout.tsx
import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleToggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleCloseSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#0F172A" }}>
      <Sidebar isOpen={sidebarOpen} onClose={handleCloseSidebar} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Header onToggleSidebar={handleToggleSidebar} />
        <main style={{ flex: 1, padding: 32, background: "linear-gradient(135deg, #0F172A 60%, #1E293B 100%)" }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
