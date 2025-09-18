// src/adminRoutes.ts
import express, { Request, Response, NextFunction } from "express";
import prisma from "./prismaClient.js";

const router = express.Router();

// Middleware simulação admin
function isAdmin(req: Request & { user?: { role?: string } }, res: Response, next: NextFunction) {
  req.user = { role: "admin" };
  next();
}

// GET: listar todos os usuários
router.get("/users", isAdmin, async (_req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, facebookId: true, name: true, role: true, status: true, createdAt: true },
    });
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao buscar usuários" });
  }
});

// GET: listar usuários bloqueados
router.get("/users/blocked", isAdmin, async (_req: Request, res: Response) => {
  try {
    const blockedUsers = await prisma.user.findMany({
      where: { status: "bloqueado" },
      select: { id: true, facebookId: true, name: true, role: true, status: true, createdAt: true },
    });

    const totalBlocked = blockedUsers.length;

    res.json({ totalBlocked, blockedUsers });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao buscar usuários bloqueados" });
  }
});

// POST: alterar status do usuário (bloquear/desbloquear)
router.post("/users/:id/status", isAdmin, async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { status } = req.body;

    if (!["ativo", "bloqueado"].includes(status)) {
      return res.status(400).json({ error: "Status inválido" });
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: { status },
    });

    res.json({ success: true, user: updatedUser });
  } catch (err: any) {
    console.error(err);
    res.status(err.code === "P2025" ? 404 : 500).json({ error: err.message || "Erro ao atualizar status" });
  }
});

export default router;
