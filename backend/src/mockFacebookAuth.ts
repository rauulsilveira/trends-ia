import prisma from "./prismaClient.js";

/**
 * Mock da função de autenticação do Facebook
 * Recebe um token falso e retorna um usuário fictício.
 */
export async function authenticateFacebookUser(fbToken: string) {
  try {
    console.log("⚡ Usando mock do Facebook, token recebido:", fbToken);

    // Mock do usuário retornado pelo Facebook
    const mockUserData = {
      id: "123456789", // Facebook ID fictício
      name: "Raul Silveira",
      picture: { data: { url: "https://example.com/avatar.jpg" } },
    };

    // Inserir ou atualizar usuário no banco (mesma lógica da função real)
    const user = await prisma.user.upsert({
      where: { facebookId: mockUserData.id },
      update: {
        name: mockUserData.name,
        picture: mockUserData.picture.data.url,
      },
      create: {
        facebookId: mockUserData.id,
        name: mockUserData.name,
        picture: mockUserData.picture.data.url,
      },
    });

    console.log("✅ Usuário mock autenticado:", user.name);
    return user;
  } catch (err) {
    console.error("❌ Erro no mock do Facebook:", err);
    throw err;
  }
}
