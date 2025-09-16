// src/facebookAuth.ts
import prisma from "./prismaClient.js";
const FACEBOOK_APP_ID = process.env.FACEBOOK_APP_ID;
const FACEBOOK_APP_SECRET = process.env.FACEBOOK_APP_SECRET;
const USE_FACEBOOK_MOCK = process.env.USE_FACEBOOK_MOCK === "true";
export async function authenticateFacebookUser(token) {
    if (!token)
        throw new Error("Token não enviado");
    if (USE_FACEBOOK_MOCK) {
        console.log("Usando mock do Facebook para login");
        const mockUser = {
            id: "mock123",
            name: "Usuário Mock",
            picture: { data: { url: "https://placekitten.com/200/200" } },
        };
        return await prisma.user.upsert({
            where: { facebookId: mockUser.id },
            update: { name: mockUser.name, picture: mockUser.picture.data.url },
            create: { facebookId: mockUser.id, name: mockUser.name, picture: mockUser.picture.data.url },
        });
    }
    const debugTokenUrl = `https://graph.facebook.com/debug_token?input_token=${token}&access_token=${FACEBOOK_APP_ID}|${FACEBOOK_APP_SECRET}`;
    const debugRes = await fetch(debugTokenUrl);
    const debugData = await debugRes.json();
    if (!debugData.data || !debugData.data.is_valid) {
        throw new Error("Token inválido do Facebook");
    }
    const fbUserId = debugData.data.user_id;
    const userInfoUrl = `https://graph.facebook.com/${fbUserId}?fields=id,name,picture&access_token=${token}`;
    const userRes = await fetch(userInfoUrl);
    const userData = await userRes.json();
    return await prisma.user.upsert({
        where: { facebookId: userData.id },
        update: { name: userData.name, picture: userData.picture?.data?.url || null },
        create: { facebookId: userData.id, name: userData.name, picture: userData.picture?.data?.url || null },
    });
}
