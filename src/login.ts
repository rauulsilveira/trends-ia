import express from "express";
import prisma from "./prismaClient.js";
import jwt from "jsonwebtoken";

const router = express.Router();

// Tipo para resposta do Facebook
interface FacebookUser {
  id: string;
  name: string;
  picture?: {
    data?: {
      url?: string;
    };
  };
  error?: {
    message: string;
    type: string;
    code: number;
  };
}

// Login com Facebook
router.post("/facebook", async (req, res) => {
  try {
    const { accessToken } = req.body;

    if (!accessToken) {
      return res.status(400).json({ error: "AccessToken não enviado" });
    }

    // 1. Valida token no Facebook
    const fbResponse = await fetch(
      `https://graph.facebook.com/me?fields=id,name,picture&access_token=${accessToken}`
    );

    const fbData: FacebookUser = await fbResponse.json();

    if (fbData.error) {
      return res.status(401).json({ error: "Token inválido" });
    }

    // 2. Cria ou atualiza usuário no banco
    const user = await prisma.user.upsert({
      where: { facebookId: fbData.id },
      update: {
        name: fbData.name,
        picture: fbData.picture?.data?.url,
      },
      create: {
        facebookId: fbData.id,
        name: fbData.name,
        picture: fbData.picture?.data?.url,
      },
    });

    // 3. Gera JWT
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || "trendly_secret",
      { expiresIn: "7d" }
    );

    res.json({ token, user });
  } catch (err) {
    console.error("Erro no login com Facebook:", err);
    res.status(500).json({ error: "Erro interno" });
  }
});

// Logout (apenas simbólico no backend)
router.post("/logout", (_req, res) => {
  res.json({ message: "Logout realizado com sucesso" });
});

export default router;
