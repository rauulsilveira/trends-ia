import prisma from "./prismaClient.js";

const FACEBOOK_APP_ID = process.env.FACEBOOK_APP_ID;
const FACEBOOK_APP_SECRET = process.env.FACEBOOK_APP_SECRET;

/**
 * Recebe o token do frontend e retorna o usuário autenticado.
 */
export async function authenticateFacebookUser(fbToken: string) {
  try {
    // 1️⃣ Validar token com o Facebook
    const debugTokenUrl = `https://graph.facebook.com/debug_token?input_token=${fbToken}&access_token=${FACEBOOK_APP_ID}|${FACEBOOK_APP_SECRET}`;
    const debugRes = await fetch(debugTokenUrl);
    const debugData = await debugRes.json();

    if (!debugData.data || !debugData.data.is_valid) {
      throw new Error("Token inválido do Facebook");
    }

    const fbUserId = debugData.data.user_id;

    // 2️⃣ Pegar informações do usuário
    const userInfoUrl = `https://graph.facebook.com/${fbUserId}?fields=id,name,picture&access_token=${fbToken}`;
    const userRes = await fetch(userInfoUrl);
    const userData = await userRes.json();

    // 3️⃣ Inserir ou atualizar usuário no banco
    const user = await prisma.user.upsert({
      where: { facebookId: userData.id },
      update: {
        name: userData.name,
        picture: userData.picture?.data?.url || null,
      },
      create: {
        facebookId: userData.id,
        name: userData.name,
        picture: userData.picture?.data?.url || null,
      },
    });

    return user;
  } catch (err) {
    console.error("Erro ao autenticar usuário do Facebook:", err);
    throw err;
  }
}
