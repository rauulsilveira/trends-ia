import express from "express";
import { PrismaClient } from "@prisma/client";
import { generateTrendContent } from "./aiProcessor.js";
const prisma = new PrismaClient();
const router = express.Router();
// Middleware simulação admin
function isAdmin(req, res, next) {
    req.user = { role: "admin" };
    next();
}
// 🟢 Função helper para atualizar trend
async function updateTrend(id, data, actionName) {
    const trend = await prisma.trend.findUnique({ where: { id } });
    if (!trend)
        throw new Error("Trend não encontrada");
    const updated = await prisma.trend.update({ where: { id }, data });
    console.info(`Trend ${id} - ${actionName}`);
    return updated;
}
// GET: trends pendentes
router.get("/trends/pending", isAdmin, async (req, res) => {
    try {
        const trends = await prisma.trend.findMany({
            where: { approved: false, rejected: false },
            orderBy: { trendDate: "desc" },
        });
        res.json(trends);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro ao buscar trends pendentes" });
    }
});
// POST: aprovar trend
router.post("/trends/:id/approve", isAdmin, async (req, res) => {
    try {
        const id = Number(req.params.id);
        const updated = await updateTrend(id, { approved: true, rejected: false, rewriteRequested: false }, "aprovada");
        res.json({ success: true, trend: updated });
    }
    catch (error) {
        console.error(error);
        res.status(error.message === "Trend não encontrada" ? 404 : 500).json({ error: error.message });
    }
});
// POST: rejeitar trend
router.post("/trends/:id/reject", isAdmin, async (req, res) => {
    try {
        const id = Number(req.params.id);
        const updated = await updateTrend(id, { approved: false, rejected: true, rewriteRequested: false }, "rejeitada");
        res.json({ success: true, trend: updated });
    }
    catch (error) {
        console.error(error);
        res.status(error.message === "Trend não encontrada" ? 404 : 500).json({ error: error.message });
    }
});
// POST: pedir reescrita via IA (com processamento imediato)
router.post("/trends/:id/rewrite", isAdmin, async (req, res) => {
    try {
        const id = Number(req.params.id);
        const trend = await prisma.trend.findUnique({ where: { id } });
        if (!trend)
            return res.status(404).json({ error: "Trend não encontrada" });
        // Marcar para reescrita
        await prisma.trend.update({ where: { id }, data: { rewriteRequested: true, approved: false } });
        // Processar via IA imediatamente
        const processed = await generateTrendContent(trend.id, trend.title);
        res.json({ success: true, message: "Trend reescrita via IA", trend: { ...trend, ...processed } });
    }
    catch (error) {
        console.error(error);
        res.status(error.message === "Trend não encontrada" ? 404 : 500).json({ error: error.message });
    }
});
// 🟢 Processar trends via IA (enfileirar para worker)
router.post("/trends/process", isAdmin, async (req, res) => {
    try {
        const pendingTrends = await prisma.trend.findMany({
            where: { approved: false, rejected: false, contentGenerated: false },
            orderBy: { trendDate: "desc" },
        });
        const enqueuedIds = pendingTrends.map(t => t.id);
        console.info(`Trends enfileiradas para processamento: ${enqueuedIds.join(", ")}`);
        // Não processa direto, o worker em background vai cuidar disso
        res.json({ message: "Trends enfileiradas para processamento via worker", enqueuedIds });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erro ao enfileirar trends" });
    }
});
export default router;
