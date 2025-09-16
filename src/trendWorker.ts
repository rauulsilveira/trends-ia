import { PrismaClient } from "@prisma/client";
import { generateTrendContent } from "./aiProcessor.js";
import pLimit from "p-limit";

const prisma = new PrismaClient();

// Fila simples em memória
const trendQueue: number[] = [];

// Limite de requisições simultâneas para o OpenAI
const limit = pLimit(2); // ajusta conforme necessário

// Delay helper
function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Função para enfileirar trends pendentes ou para reprocessamento
async function enqueuePendingTrends() {
  const now = new Date();
  const pendingTrends = await prisma.trend.findMany({
    where: {
      OR: [
        { approved: false, rejected: false, contentGenerated: false },
        { nextRetryAt: { lte: now } } // trends que falharam antes
      ]
    },
    orderBy: { trendDate: "desc" },
  });

  for (const trend of pendingTrends) {
    if (!trendQueue.includes(trend.id)) {
      trendQueue.push(trend.id);
    }
  }
  console.info(`📥 Trends enfileiradas: ${trendQueue.length}`);
}

// Função para processar trends da fila (batch de 10)
async function processQueue() {
  const batch = trendQueue.splice(0, 10); // remove até 10 trends da fila
  if (batch.length === 0) return;

  console.info(`➡️ Iniciando batch de ${batch.length} trends...`);

  await Promise.all(batch.map(id =>
    limit(async () => {
      try {
        const trend = await prisma.trend.findUnique({ where: { id } });
        if (!trend) return;

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
          },
        });
        console.info(`✅ Trend ${id} processada com sucesso.`);
      } catch (err) {
        // Obtendo retryCount atual antes de atualizar
        const trendData = await prisma.trend.findUnique({ where: { id } });
        const retries = trendData?.retryCount ?? 0;

        console.error(`❌ Erro ao processar trend ${id} (tentativa ${retries + 1}):`, err);

        // Incrementa retryCount e agenda próximo retry em 5 min
        await prisma.trend.update({
          where: { id },
          data: {
            retryCount: { increment: 1 },
            nextRetryAt: new Date(Date.now() + 1000 * 60 * 5)
          }
        });
      }
    })
  ));

  console.info(`⏹️ Batch finalizado. Pausando 5s antes do próximo batch...`);
  await delay(5000); // pausa 5s entre batches
}

// Cron simples: roda a cada 1 minuto
setInterval(async () => {
  try {
    await enqueuePendingTrends();
    await processQueue();
  } catch (err) {
    console.error("⚠️ Erro no cron do worker:", err);
  }
}, 60 * 1000); // 60s
console.info("🚀 Trend Worker iniciado, aguardando trends na fila...");