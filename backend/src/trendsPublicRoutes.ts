import express, { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

// GET /public/google/top-clicks?limit=20
router.get("/google/top-clicks", async (req: Request, res: Response) => {
  try {
    const limit = Math.min(parseInt(String(req.query.limit || 20), 10) || 20, 100);
    const where = {
      source: "google",
      approved: true,
      rejected: false,
      contentGenerated: true,
    } as const;
    const [trends, total] = await Promise.all([
      prisma.trend.findMany({
        where,
        orderBy: [
          { searchVolume: "desc" },
          { trendDate: "desc" },
        ],
        take: limit,
      }),
      prisma.trend.count({ where }),
    ]);
    res.json({ items: trends, total });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar mais clicados (Google)" });
  }
});

// GET /public/google/top-trends?limit=20
router.get("/google/top-trends", async (req: Request, res: Response) => {
  try {
    const limit = Math.min(parseInt(String(req.query.limit || 20), 10) || 20, 100);
    const where = {
      source: "google",
      approved: true,
      rejected: false,
      contentGenerated: true,
    } as const;
    const [trends, total] = await Promise.all([
      prisma.trend.findMany({
        where,
        orderBy: [
          { growthPercent: "desc" },
          { trendDate: "desc" },
        ],
        take: limit,
      }),
      prisma.trend.count({ where }),
    ]);
    res.json({ items: trends, total });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar maiores tendências (Google)" });
  }
});

export default router;


