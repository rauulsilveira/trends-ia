import React, { useEffect, useState } from "react";
import { useUser } from "../../contexts/UserContext";
import { fetchUsers, updateUserRole, updateUserStatus, deleteUser, type User } from "../../services/usersApi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function UsersPage() {
  const { user: currentUser } = useUser();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<number | null>(null);
  const [showConfirm, setShowConfirm] = useState<{ userId: number; action: string; userName: string } | null>(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await fetchUsers();
      console.log("Dados recebidos:", data);
      console.log("Usuário atual:", currentUser);
      
      // Verificar se data.users existe, senão usar data diretamente
      const usersArray = data.users || data;
      setUsers(Array.isArray(usersArray) ? usersArray : []);
    } catch (err: any) {
      console.error("Erro ao carregar usuários:", err);
      setError(err.message || "Erro ao carregar usuários");
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId: number, newRole: "user" | "admin", userName: string) => {
    if (newRole === "admin") {
      setShowConfirm({ userId, action: "promote", userName });
    } else {
      setShowConfirm({ userId, action: "demote", userName });
    }
  };

  const handleStatusChange = async (userId: number, newStatus: "ativo" | "bloqueado", userName: string) => {
    if (newStatus === "bloqueado") {
      setShowConfirm({ userId, action: "block", userName });
    } else {
      setShowConfirm({ userId, action: "unblock", userName });
    }
  };

  const handleDelete = async (userId: number, userName: string) => {
    setShowConfirm({ userId, action: "delete", userName });
  };

  const confirmAction = async () => {
    if (!showConfirm) return;

    const { userId, action, userName } = showConfirm;
    setBusyId(userId);

    try {
      switch (action) {
        case "promote":
          await updateUserRole(userId, "admin");
          toast.success(`${userName} promovido a administrador!`);
          break;
        case "demote":
          await updateUserRole(userId, "user");
          toast.success(`${userName} rebaixado a usuário!`);
          break;
        case "block":
          await updateUserStatus(userId, "bloqueado");
          toast.success(`${userName} foi bloqueado!`);
          break;
        case "unblock":
          await updateUserStatus(userId, "ativo");
          toast.success(`${userName} foi desbloqueado!`);
          break;
        case "delete":
          await deleteUser(userId);
          toast.success(`${userName} foi removido permanentemente!`);
          break;
      }
      
      await loadUsers(); // Recarregar lista
    } catch (err: any) {
      toast.error(err.message || "Erro ao executar ação");
    } finally {
      setBusyId(null);
      setShowConfirm(null);
    }
  };

  const getRoleColor = (role: string) => {
    return role === "admin" ? "#ef4444" : "#3e8cff";
  };

  const getStatusColor = (status: string) => {
    return status === "ativo" ? "#22c55e" : "#ef4444";
  };

  if (loading) {
    return (
      <div style={{ color: "white", textAlign: "center", padding: "40px" }}>
        <h1>Usuários</h1>
        <p>Carregando...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ color: "white", textAlign: "center", padding: "40px" }}>
        <h1>Usuários</h1>
        <p style={{ color: "#ff6b6b" }}>{error}</p>
        <button onClick={loadUsers} style={{ padding: "8px 16px", borderRadius: 6, background: "#3e8cff", color: "white", border: "none", cursor: "pointer" }}>
          Tentar novamente
        </button>
      </div>
    );
  }

  return (
    <>
      <div style={{ color: "white" }}>
        <h1>Gerenciar Usuários</h1>
        <p style={{ color: "#b8c1ec", marginBottom: 24 }}>
          Total: {users?.length || 0} usuários
        </p>

        <div style={{ display: "grid", gap: 16 }}>
          {users?.map((user) => (
            <div
              key={user.id}
              style={{
                background: "#3e497a33",
                padding: 20,
                borderRadius: 12,
                border: "1.5px solid #3e8cff",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                opacity: busyId === user.id ? 0.7 : 1
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                {user.picture && (
                  <img
                    src={user.picture}
                    alt={user.name}
                    style={{
                      width: 50,
                      height: 50,
                      borderRadius: "50%",
                      objectFit: "cover"
                    }}
                  />
                )}
    <div>
                  <h3 style={{ margin: 0, color: "#e0e6f7" }}>{user.name}</h3>
                  <p style={{ margin: "4px 0", color: "#b8c1ec", fontSize: 14 }}>
                    ID: {user.facebookId} • Logins: {user._count?.LoginLogs || 0}
                  </p>
                  <p style={{ margin: 0, color: "#b8c1ec", fontSize: 12 }}>
                    Criado em: {new Date(user.createdAt).toLocaleDateString("pt-BR")}
                  </p>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                  <span
                    style={{
                      background: getRoleColor(user.role),
                      color: "white",
                      padding: "4px 8px",
                      borderRadius: 4,
                      fontSize: 12,
                      fontWeight: 600
                    }}
                  >
                    {user.role === "admin" ? "ADMIN" : "USER"}
                  </span>
                  <span
                    style={{
                      background: getStatusColor(user.status),
                      color: "white",
                      padding: "2px 6px",
                      borderRadius: 4,
                      fontSize: 10,
                      fontWeight: 600
                    }}
                  >
                    {user.status.toUpperCase()}
                  </span>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {/* Role */}
                  <div style={{ display: "flex", gap: 4 }}>
                    <button
                      disabled={busyId === user.id || Number(currentUser?.id) === user.id}
                      onClick={() => handleRoleChange(user.id, "user", user.name)}
                      style={{
                        padding: "4px 8px",
                        borderRadius: 4,
                        background: user.role === "user" ? "#3e8cff" : "#6b7280",
                        color: "white",
                        border: "none",
                        cursor: "pointer",
                        fontSize: 12,
                        opacity: Number(currentUser?.id) === user.id ? 0.5 : 1
                      }}
                    >
                      User
                    </button>
                    <button
                      disabled={busyId === user.id || Number(currentUser?.id) === user.id}
                      onClick={() => handleRoleChange(user.id, "admin", user.name)}
                      style={{
                        padding: "4px 8px",
                        borderRadius: 4,
                        background: user.role === "admin" ? "#ef4444" : "#6b7280",
                        color: "white",
                        border: "none",
                        cursor: "pointer",
                        fontSize: 12,
                        opacity: Number(currentUser?.id) === user.id ? 0.5 : 1
                      }}
                    >
                      Admin
                    </button>
                  </div>

                  {/* Status */}
                  <div style={{ display: "flex", gap: 4 }}>
                    <button
                      disabled={busyId === user.id || Number(currentUser?.id) === user.id}
                      onClick={() => handleStatusChange(user.id, "ativo", user.name)}
                      style={{
                        padding: "4px 8px",
                        borderRadius: 4,
                        background: user.status === "ativo" ? "#22c55e" : "#6b7280",
                        color: "white",
                        border: "none",
                        cursor: "pointer",
                        fontSize: 12,
                        opacity: Number(currentUser?.id) === user.id ? 0.5 : 1
                      }}
                    >
                      Ativo
                    </button>
                    <button
                      disabled={busyId === user.id || Number(currentUser?.id) === user.id}
                      onClick={() => handleStatusChange(user.id, "bloqueado", user.name)}
                      style={{
                        padding: "4px 8px",
                        borderRadius: 4,
                        background: user.status === "bloqueado" ? "#ef4444" : "#6b7280",
                        color: "white",
                        border: "none",
                        cursor: "pointer",
                        fontSize: 12,
                        opacity: Number(currentUser?.id) === user.id ? 0.5 : 1
                      }}
                    >
                      Bloqueado
                    </button>
                  </div>

                  {/* Delete */}
                  <button
                    disabled={busyId === user.id || Number(currentUser?.id) === user.id}
                    onClick={() => handleDelete(user.id, user.name)}
                    style={{
                      padding: "4px 8px",
                      borderRadius: 4,
                      background: "#ef4444",
                      color: "white",
                      border: "none",
                      cursor: "pointer",
                      fontSize: 12,
                      opacity: Number(currentUser?.id) === user.id ? 0.5 : 1
                    }}
                  >
                    Deletar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal de confirmação */}
      {showConfirm && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0,0,0,0.7)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1000
        }}>
          <div style={{
            background: "#232946",
            padding: 32,
            borderRadius: 12,
            color: "white",
            textAlign: "center",
            maxWidth: 400,
            width: "90%"
          }}>
            <h2 style={{ margin: "0 0 16px 0", color: "#ef4444" }}>
              {showConfirm.action === "promote" && "Promover a Admin"}
              {showConfirm.action === "demote" && "Rebaixar a User"}
              {showConfirm.action === "block" && "Bloquear Usuário"}
              {showConfirm.action === "unblock" && "Desbloquear Usuário"}
              {showConfirm.action === "delete" && "Deletar Usuário"}
            </h2>
            
            <p style={{ margin: "0 0 24px 0", color: "#b8c1ec" }}>
              {showConfirm.action === "promote" && `Tem certeza que deseja promover "${showConfirm.userName}" a administrador?`}
              {showConfirm.action === "demote" && `Tem certeza que deseja rebaixar "${showConfirm.userName}" a usuário?`}
              {showConfirm.action === "block" && `Tem certeza que deseja bloquear "${showConfirm.userName}"?`}
              {showConfirm.action === "unblock" && `Tem certeza que deseja desbloquear "${showConfirm.userName}"?`}
              {showConfirm.action === "delete" && `⚠️ ATENÇÃO: Esta ação é irreversível! Tem certeza que deseja deletar permanentemente "${showConfirm.userName}"?`}
            </p>

            <div style={{ display: "flex", justifyContent: "center", gap: 16 }}>
              <button
                onClick={() => setShowConfirm(null)}
                style={{
                  padding: "8px 16px",
                  borderRadius: 6,
                  background: "#6b7280",
                  color: "#fff",
                  border: "none",
                  cursor: "pointer"
                }}
                disabled={busyId === showConfirm.userId}
              >
                Cancelar
              </button>
              <button
                onClick={confirmAction}
                style={{
                  padding: "8px 16px",
                  borderRadius: 6,
                  background: showConfirm.action === "delete" ? "#ef4444" : "#3e8cff",
                  color: "#fff",
                  border: "none",
                  cursor: "pointer"
                }}
                disabled={busyId === showConfirm.userId}
              >
                {busyId === showConfirm.userId ? "Processando..." : "Confirmar"}
              </button>
            </div>
          </div>
    </div>
      )}

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar theme="dark" />
    </>
  );
}