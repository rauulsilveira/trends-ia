// src/pages/admin/AdminUsers.tsx
import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getBlockedUsers, unblockUser } from "../../services/adminApi";

interface AdminUsersProps {
  user: any;
  setUser: (u: any) => void;
}

interface BlockedUser {
  id: number;
  name: string;
  facebookId: string;
  role: string;
  status: string;
  createdAt: string;
}

export default function AdminUsers({ user, setUser }: AdminUsersProps) {
  const [blockedUsers, setBlockedUsers] = useState<BlockedUser[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await getBlockedUsers();
      setBlockedUsers(data.blockedUsers || []);
    } catch (err) {
      console.error(err);
      toast.error("Erro ao buscar usuários bloqueados");
    } finally {
      setLoading(false);
    }
  };

  const handleUnblock = async (id: number) => {
    try {
      await unblockUser(id);
      toast.success("Usuário desbloqueado com sucesso!");
      setBlockedUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (err) {
      console.error(err);
      toast.error("Erro ao desbloquear usuário");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div>
      <h3 style={{ color: "#e0e6f7", marginBottom: 16 }}>Usuários Bloqueados</h3>

      {loading ? (
        <p style={{ color: "#b8c1ec" }}>Carregando...</p>
      ) : blockedUsers.length === 0 ? (
        <p style={{ color: "#b8c1ec" }}>Nenhum usuário bloqueado</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {blockedUsers.map((u) => (
            <div
              key={u.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                background: "#3e497a33",
                padding: "12px 16px",
                borderRadius: 12,
                border: "1.5px solid #3e8cff",
                color: "#e0e6f7",
              }}
            >
              <div>
                <p style={{ margin: 0, fontWeight: 600 }}>{u.name}</p>
                <span style={{ fontSize: 12, color: "#b8c1ec" }}>
                  Bloqueado em: {new Date(u.createdAt).toLocaleString()}
                </span>
              </div>

              <button
                onClick={() => handleUnblock(u.id)}
                style={{
                  background: "linear-gradient(90deg, #3e8cff 60%, #2563eb 100%)",
                  color: "#fff",
                  border: "none",
                  padding: "6px 12px",
                  borderRadius: 8,
                  cursor: "pointer",
                  fontWeight: 600,
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#2563eb")}
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "linear-gradient(90deg, #3e8cff 60%, #2563eb 100%)")
                }
              >
                Desbloquear
              </button>
            </div>
          ))}
        </div>
      )}

      <ToastContainer position="top-right" autoClose={3000} limit={3} />
    </div>
  );
}
