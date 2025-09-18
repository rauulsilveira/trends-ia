// src/pages/admin/AdminConfig.tsx
import React from "react";

interface AdminConfigProps {
  user: any;
  setUser: (u: any) => void;
}

export default function AdminConfig({ user, setUser }: AdminConfigProps) {
  return (
    <div>
      <h3 style={{ color: "#fff", marginBottom: 12 }}>Configurações do Admin</h3>
      <p style={{ color: "#b8c1ec" }}>Aqui você pode adicionar ajustes gerais do sistema.</p>
    </div>
  );
}
