import express from "express";
import prisma from "./prismaClient.js";
import jwt from "jsonwebtoken";

const router = express.Router();

// Middleware de autenticação
const authenticateAdmin = (req: any, res: any, next: any) => {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) {
    return res.status(401).json({ error: "Token não fornecido" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "trendly_secret") as any;
    if (decoded.role !== "admin") {
      return res.status(403).json({ error: "Acesso negado" });
    }
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Token inválido" });
  }
};

// Listar todos os usuários
router.get("/users", authenticateAdmin, async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: { LoginLogs: true }
        }
      }
    });

    res.json({ users });
  } catch (error) {
    console.error("Erro ao buscar usuários:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

// Atualizar role do usuário (user/admin)
router.patch("/users/:id/role", authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!["user", "admin"].includes(role)) {
      return res.status(400).json({ error: "Role inválido" });
    }

    const user = await prisma.user.findUnique({ where: { id: parseInt(id) } });
    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    // Não permitir que o próprio usuário remova seu admin
    if (req.user.id === parseInt(id) && role === "user") {
      return res.status(400).json({ error: "Você não pode remover seu próprio acesso de admin" });
    }

    const updatedUser = await prisma.user.update({
      where: { id: parseInt(id) },
      data: { role },
      select: {
        id: true,
        name: true,
        role: true,
        status: true
      }
    });

    res.json({ 
      message: `Usuário ${updatedUser.name} agora é ${role === "admin" ? "administrador" : "usuário"}`,
      user: updatedUser
    });
  } catch (error) {
    console.error("Erro ao atualizar role:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

// Atualizar status do usuário (ativo/bloqueado)
router.patch("/users/:id/status", authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["ativo", "bloqueado"].includes(status)) {
      return res.status(400).json({ error: "Status inválido" });
    }

    const user = await prisma.user.findUnique({ where: { id: parseInt(id) } });
    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    // Não permitir que o próprio usuário se bloqueie
    if (req.user.id === parseInt(id) && status === "bloqueado") {
      return res.status(400).json({ error: "Você não pode bloquear a si mesmo" });
    }

    const updatedUser = await prisma.user.update({
      where: { id: parseInt(id) },
      data: { status },
      select: {
        id: true,
        name: true,
        role: true,
        status: true
      }
    });

    res.json({ 
      message: `Usuário ${updatedUser.name} foi ${status === "ativo" ? "desbloqueado" : "bloqueado"}`,
      user: updatedUser
    });
  } catch (error) {
    console.error("Erro ao atualizar status:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

// Deletar usuário (soft delete)
router.delete("/users/:id", authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({ where: { id: parseInt(id) } });
    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    // Não permitir que o próprio usuário se delete
    if (req.user.id === parseInt(id)) {
      return res.status(400).json({ error: "Você não pode deletar a si mesmo" });
    }

    await prisma.user.delete({
      where: { id: parseInt(id) }
    });

    res.json({ 
      message: `Usuário ${user.name} foi removido permanentemente`
    });
  } catch (error) {
    console.error("Erro ao deletar usuário:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

export default router;
