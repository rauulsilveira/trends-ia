// src/layouts/AppLayout.tsx
import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

export default function AppLayout() {
  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#232946" }}>
      <Sidebar />
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Header />
        <main style={{ flex: 1, padding: 32, background: "linear-gradient(135deg, #232946 60%, #3e497a 100%)" }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
