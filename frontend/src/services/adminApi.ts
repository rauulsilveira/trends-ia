const API_URL = "http://localhost:4000";

export async function getBlockedUsers() {
  const response = await fetch(`${API_URL}/admin/users/blocked`);
  if (!response.ok) throw new Error("Erro ao buscar usuários bloqueados");
  return response.json(); // { blockedUsers: [...] }
}

export async function unblockUser(id: number) {
  const response = await fetch(`${API_URL}/admin/users/unblock/${id}`, {
    method: "POST",
  });
  if (!response.ok) throw new Error("Erro ao desbloquear usuário");
  return response.json();
}

// Trends Admin
export interface AdminTrendDto {
  id: number;
  title: string;
  summary: string;
  thumbnail?: string | null;
  tags: string;
  source: string;
  trendDate: string;
  approved: boolean;
  rejected: boolean;
}

export async function getPendingTrends(params?: { readyOnly?: boolean; limit?: number; offset?: number }): Promise<{ items: AdminTrendDto[]; total: number; limit: number; offset: number }> {
  const query = new URLSearchParams();
  if (params?.readyOnly) query.set("readyOnly", "1");
  if (params?.limit) query.set("limit", String(params.limit));
  if (params?.offset) query.set("offset", String(params.offset));
  const response = await fetch(`${API_URL}/admin/trends/pending${query.toString() ? `?${query.toString()}` : ""}`);
  if (!response.ok) throw new Error("Erro ao buscar trends pendentes");
  return response.json();
}

export async function approveTrend(id: number) {
  const response = await fetch(`${API_URL}/admin/trends/${id}/approve`, { method: "POST" });
  if (!response.ok) throw new Error("Erro ao aprovar trend");
  return response.json();
}

export async function rejectTrend(id: number) {
  const response = await fetch(`${API_URL}/admin/trends/${id}/reject`, { method: "POST" });
  if (!response.ok) throw new Error("Erro ao rejeitar trend");
  return response.json();
}

export async function rewriteTrend(id: number): Promise<{ success: boolean; message: string; trend: AdminTrendDto }> {
  const response = await fetch(`${API_URL}/admin/trends/${id}/rewrite`, { method: "POST" });
  if (!response.ok) throw new Error("Erro ao reescrever trend via IA");
  return response.json();
}

export async function deleteTrend(id: number) {
  const response = await fetch(`${API_URL}/admin/trends/${id}/delete`, { method: "POST" });
  if (!response.ok) throw new Error("Erro ao remover trend");
  return response.json();
}