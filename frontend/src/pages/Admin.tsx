import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getBlockedUsers, unblockUser } from "../services/adminApi";
import { useUser } from "../contexts/UserContext";

interface BlockedUser {
  id: number;
  name: string;
  facebookId: string;
  role: string;
  status: string;
  createdAt: string;
}

export default function Admin() {
  const { user } = useUser();
  const [blockedUsers, setBlockedUsers] = useState<BlockedUser[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchBlockedUsers = async () => {
    try {
      setLoading(true);
      const data = await getBlockedUsers();
      setBlockedUsers(data.blockedUsers);
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
      setBlockedUsers(blockedUsers.filter(u => u.id !== id));
    } catch (err) {
      console.error(err);
      toast.error("Erro ao desbloquear usuário");
    }
  };

  useEffect(() => {
    fetchBlockedUsers();
  }, []);

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <Sidebar />

      <main
        style={{
          flex: 1,
          padding: 32,
          background: "linear-gradient(135deg, #232946 60%, #3e497a 100%)",
          overflowY: "auto",
        }}
      >
        <Header />

        <h2 style={{ color: "#e0e6f7", marginBottom: 20 }}>Usuários Bloqueados</h2>

        {loading ? (
          <p style={{ color: "#b8c1ec" }}>Carregando...</p>
        ) : blockedUsers.length === 0 ? (
          <p style={{ color: "#b8c1ec" }}>Nenhum usuário bloqueado</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {blockedUsers.map(u => (
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
                    transition: "background 0.2s",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = "#2563eb")}
                  onMouseLeave={e =>
                    (e.currentTarget.style.background =
                      "linear-gradient(90deg, #3e8cff 60%, #2563eb 100%)")
                  }
                >
                  Desbloquear
                </button>
              </div>
            ))}
          </div>
        )}

        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          pauseOnFocusLoss
          draggable
          pauseOnHover
          limit={3}
        />
      </main>
    </div>
  );
}
