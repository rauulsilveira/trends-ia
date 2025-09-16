import { PrismaClient } from "@prisma/client";
import { generateTrendContent } from "./aiProcessor.js";
import pLimit from "p-limit";
const prisma = new PrismaClient();
const limit = pLimit(1); // 1 trend por vez para respeitar o rate limit
// Fila simples em memória
const trendQueue = [];
// Enfileira trends pendentes ou para retry
async function enqueuePendingTrends() {
    const now = new Date();
    const pendingTrends = await prisma.trend.findMany({
        where: {
            OR: [
                { approved: false, rejected: false, contentGenerated: false },
                { nextRetryAt: { lte: now } }
            ]
        },
        orderBy: { trendDate: "desc" },
    });
    for (const trend of pendingTrends) {
        if (!trendQueue.includes(trend.id)) {
            trendQueue.push(trend.id);
        }
    }
    console.info(`Trends enfileiradas: ${trendQueue.length}`);
}
// Processa trends da fila com controle de concorrência
async function processQueue() {
    const batch = trendQueue.splice(0, 10);
    if (!batch.length)
        return;
    console.info(`Processando batch de ${batch.length} trends...`);
    await Promise.all(batch.map(id => limit(async () => {
        try {
            const trend = await prisma.trend.findUnique({ where: { id } });
            if (!trend)
                return;
            const processed = await generateTrendContent(trend.id, trend.title);
            await prisma.trend.update({
                where: { id },
                data: {
                    summary: processed.summary,
                    tags: processed.tags.join(", "),
                    thumbnail: processed.thumbnail,
                    contentGenerated: true,
                    processedAt: new Date(),
                    rewriteRequested: false,
                    retryCount: 0,
                    nextRetryAt: null
                }
            });
            console.info(`Trend ${id} processada com sucesso.`);
        }
        catch (err) {
            console.error(`Erro ao processar trend ${id}:`, err);
            // Incrementa retryCount e agenda próximo retry em 5 min
            await prisma.trend.update({
                where: { id },
                data: {
                    retryCount: { increment: 1 },
                    nextRetryAt: new Date(Date.now() + 1000 * 60 * 5)
                }
            });
        }
    })));
}
// Cron simples: roda a cada 1 minuto
setInterval(async () => {
    try {
        await enqueuePendingTrends();
        await processQueue();
    }
    catch (err) {
        console.error("Erro no cron do worker:", err);
    }
}, 60 * 1000);
