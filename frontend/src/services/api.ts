const API_URL = "http://localhost:4000";

export async function loginWithFacebook(accessToken: string) {
  const response = await fetch(`${API_URL}/auth/facebook`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ accessToken }),
  });

  if (!response.ok) {
    throw new Error("Erro ao autenticar com o servidor");
  }

  return response.json(); // { token, user }
}

export async function logout() {
  await fetch(`${API_URL}/auth/logout`, { method: "POST" });
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}
