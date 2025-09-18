const API_BASE = "http://localhost:4000";

export interface User {
  id: number;
  facebookId: string;
  name: string;
  picture?: string;
  role: "user" | "admin";
  status: "ativo" | "bloqueado";
  createdAt: string;
  _count?: {
    LoginLogs: number;
  };
}

export interface UsersResponse {
  users: User[];
}

export interface UpdateRoleRequest {
  role: "user" | "admin";
}

export interface UpdateStatusRequest {
  status: "ativo" | "bloqueado";
}

export interface ApiResponse {
  message: string;
  user?: User;
}

// Buscar todos os usuários
export async function fetchUsers(): Promise<UsersResponse> {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Token não encontrado");

  const response = await fetch(`${API_BASE}/admin/users`, {
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Erro ao buscar usuários");
  }

  return response.json();
}

// Atualizar role do usuário
export async function updateUserRole(userId: number, role: "user" | "admin"): Promise<ApiResponse> {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Token não encontrado");

  const response = await fetch(`${API_BASE}/admin/users/${userId}/role`, {
    method: "PATCH",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ role }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Erro ao atualizar role");
  }

  return response.json();
}

// Atualizar status do usuário
export async function updateUserStatus(userId: number, status: "ativo" | "bloqueado"): Promise<ApiResponse> {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Token não encontrado");

  const response = await fetch(`${API_BASE}/admin/users/${userId}/status`, {
    method: "PATCH",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Erro ao atualizar status");
  }

  return response.json();
}

// Deletar usuário
export async function deleteUser(userId: number): Promise<ApiResponse> {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Token não encontrado");

  const response = await fetch(`${API_BASE}/admin/users/${userId}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Erro ao deletar usuário");
  }

  return response.json();
}
