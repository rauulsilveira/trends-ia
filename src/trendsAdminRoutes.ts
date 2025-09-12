import express, { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = express.Router();

// Middleware de autenticação/admin
function isAdmin(req: Request & { user?: { role?: string } }, res: Response, next: NextFunction) {
  // 👉 Simulação: todo mundo é admin (apenas para testes locais)
  req.user = { role: "admin" };
  next();
}

// GET: trends pendentes
router.get("/admin/trends/pending", isAdmin, async (req: Request, res: Response) => {
  const trends = await prisma.trend.findMany({
    where: { approved: false, rejected: false },
    orderBy: { trendDate: "desc" },
  });
  res.json(trends);
});

// POST: aprovar trend
router.post("/admin/trends/:id/approve", isAdmin, async (req: Request, res: Response) => {
  const { id } = req.params;
  const trend = await prisma.trend.update({
    where: { id: Number(id) },
    data: { approved: true, rejected: false, rewriteRequested: false },
  });
  res.json(trend);
});

// POST: rejeitar trend
router.post("/admin/trends/:id/reject", isAdmin, async (req: Request, res: Response) => {
  const { id } = req.params;
  const trend = await prisma.trend.update({
    where: { id: Number(id) },
    data: { approved: false, rejected: true, rewriteRequested: false },
  });
  res.json(trend);
});

// POST: pedir reescrita via IA
router.post("/admin/trends/:id/rewrite", isAdmin, async (req: Request, res: Response) => {
  const { id } = req.params;

  const trend = await prisma.trend.update({
    where: { id: Number(id) },
    data: { rewriteRequested: true, approved: false },
  });

  res.json({ message: "Trend marcada para reescrita via IA", trend });
});

export default router;
