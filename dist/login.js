import { Router } from "express";
import prisma from "./prismaClient.js";
const USE_FACEBOOK_MOCK = process.env.USE_FACEBOOK_MOCK === "true";
const router = Router();
async function authenticateFacebookUser(token) {
    if (USE_FACEBOOK_MOCK) {
        console.log("Usando mock do Facebook para login");
        const mockUser = {
            id: "mock123",
            name: "Usuário Mock",
            picture: "https://placekitten.com/200/200",
        };
        const user = await prisma.user.upsert({
            where: { facebookId: mockUser.id },
            update: { name: mockUser.name, picture: mockUser.picture },
            create: { facebookId: mockUser.id, name: mockUser.name, picture: mockUser.picture },
        });
        return user;
    }
    // Aqui entraria a lógica real com token do Facebook
    throw new Error("Login real do Facebook não implementado ainda");
}
router.post("/login", async (req, res) => {
    try {
        const { token } = req.body;
        if (!token)
            return res.status(400).json({ error: "Token não enviado" });
        const user = await authenticateFacebookUser(token);
        res.json({ user });
    }
    catch (err) {
        console.error(err);
        res.status(400).json({ error: "Erro ao autenticar usuário" });
    }
});
export default router;
export { authenticateFacebookUser };
