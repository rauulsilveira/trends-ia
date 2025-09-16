import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import loginRouter from "./login.js";
const app = express();
// Middlewares
app.use(cors());
app.use(bodyParser.json());
// Rotas
app.use("/auth", loginRouter);
// Rota teste
app.get("/", (_req, res) => {
    res.send("Backend Trends IA funcionando!");
});
// Tratamento global de erros
app.use((err, _req, res, _next) => {
    console.error("Erro não capturado:", err);
    res.status(500).json({ error: "Erro interno do servidor" });
});
export default app;
