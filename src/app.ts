import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import loginRouter from "./login.js";
import adminRouter from "./adminRoutes.js"; // <--- import admin

const app = express();

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// Rotas
app.use("/auth", loginRouter);
app.use("/admin", adminRouter); // <--- registrar admin

// Rota teste
app.get("/", (_req: Request, res: Response) => {
  res.send("Backend Trends IA funcionando!");
});

// Tratamento global de erros
app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  console.error("Erro não capturado:", err);
  res.status(500).json({ error: "Erro interno do servidor" });
});

export default app;
