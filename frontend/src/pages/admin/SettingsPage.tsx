// src/pages/admin/SettingsPage.tsx
import React from "react";
import { useUser } from "../../contexts/UserContext";

export default function SettingsPage() {
  const { user } = useUser();

  return (
    <div style={{ color: "white" }}>
      <h1>Configurações do Admin</h1>
      <p>Usuário atual: {user?.name}</p>
    </div>
  );
}
