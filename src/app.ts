import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import trendsAdminRoutes from "./trendsAdminRoutes.js";
import { authenticateFacebookUser } from "./mockFacebookAuth.js";
import loginRouter from "./login.js"; // opcional, pode usar router separado
import { generateTrendContent } from "./aiProcessor.js"; // importar a função da IA

dotenv.config();

const app = express();
const prisma = new PrismaClient();

// Middlewares
app.use(cors());
app.use(express.json());

// Middleware de log de requisições
app.use((req: Request, _res: Response, next: NextFunction) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Rotas de login (mock)
app.post("/api/login", async (req: Request, res: Response) => {
  const { token } = req.body;
  if (!token) return res.status(400).json({ error: "Token não enviado" });

  try {
    const user = await authenticateFacebookUser(token);
    console.log("✅ Usuário autenticado:", user.name);
    res.json({ user });
  } catch (err) {
    console.error("❌ Erro ao autenticar usuário:", err);
    res.status(400).json({ error: "Erro ao autenticar usuário" });
  }
});

// Rotas admin
app.use("/api/admin", trendsAdminRoutes); // todas as rotas de admin (/trends/pending etc.)

// Rotas públicas
app.get("/", (_req: Request, res: Response) => {
  console.log("Rota / acessada");
  res.send("Backend Trends IA funcionando!");
});

app.get("/trends", async (_req: Request, res: Response) => {
  try {
    const trends = await prisma.trend.findMany({
      select: {
        id: true,
        title: true,
        summary: true,
        url: true,
        thumbnail: true,
        tags: true,
        approved: true,
        rejected: true,
        trendDate: true,
      },
      orderBy: { trendDate: "desc" },
    });
    console.log(`Retornando ${trends.length} trends`);
    res.json(trends);
  } catch (err) {
    console.error("Erro ao buscar trends:", err);
    res.status(500).json({ error: "Erro ao buscar trends" });
  }
});

// Tratamento global de erros
app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  console.error("Erro não capturado:", err);
  res.status(500).json({ error: "Erro interno do servidor" });
});

const PORT = process.env.PORT || 4000;

try {
  app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
  });
} catch (err) {
  console.error("Erro ao iniciar o backend:", err);
}


app.post("/api/admin/test-ia/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    // Buscar trend pelo ID
    const trend = await prisma.trend.findUnique({ where: { id: Number(id) } });
    if (!trend) return res.status(404).json({ error: "Trend não encontrada" });

    // Processar com IA
    await generateTrendContent(trend.id, trend.title);

    res.json({ message: "Trend processada com IA (teste)", trendId: trend.id });
  } catch (err) {
    console.error("Erro ao processar trend com IA:", err);
    res.status(500).json({ error: "Erro ao processar trend com IA" });
  }
});