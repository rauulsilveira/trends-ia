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

    let fbData: FacebookUser;

    // Verificar se é mock login
    if (accessToken === "mock_token_raul") {
      fbData = {
        id: "raul_admin",
        name: "Raul Silveira",
        picture: {
          data: {
            url: "https://via.placeholder.com/150/3e8cff/ffffff?text=RS"
          }
        }
      };
    } else {
      // 1. Valida token no Facebook
      const fbResponse = await fetch(
        `https://graph.facebook.com/me?fields=id,name,picture&access_token=${accessToken}`
      );

      fbData = await fbResponse.json();

      if (fbData.error) {
        return res.status(401).json({ error: "Token inválido" });
      }
    }

    // 2. Cria ou atualiza usuário no banco
    const user = await prisma.user.upsert({
      where: { facebookId: fbData.id },
      update: {
        name: fbData.name,
        picture: fbData.picture?.data?.url,
        status: "ativo", // Reativar se estava bloqueado
      },
      create: {
        facebookId: fbData.id,
        name: fbData.name,
        picture: fbData.picture?.data?.url,
        role: fbData.id === "24808605398764380" || fbData.id === "raul_admin" ? "admin" : "user", // Raul real é admin
        status: "ativo",
      },
    });

    // 3. Registrar login
    await prisma.loginLog.create({
      data: {
        userId: user.id,
        action: "login",
        ip: req.ip || req.connection.remoteAddress,
        device: req.headers['user-agent'] || "Unknown"
      }
    });

    // 4. Gera JWT
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

// Logout
router.post("/logout", async (req, res) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "trendly_secret") as any;
        
        // Registrar logout
        await prisma.loginLog.create({
          data: {
            userId: decoded.id,
            action: "logout",
            ip: req.ip || req.connection.remoteAddress,
            device: req.headers['user-agent'] || "Unknown"
          }
        });
      } catch (err) {
        // Token inválido, mas não é erro crítico
        console.log("Token inválido no logout:", err);
      }
    }
    
    res.json({ message: "Logout realizado com sucesso" });
  } catch (err) {
    console.error("Erro no logout:", err);
    res.status(500).json({ error: "Erro interno" });
  }
});

export default router;
