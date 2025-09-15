import { PrismaClient } from "@prisma/client";
import { generateTrendContent } from "./aiProcessor.js";

const prisma = new PrismaClient();

// Fila simples em memória
const trendQueue: number[] = [];

// Função para enfileirar trends pendentes
async function enqueuePendingTrends() {
  const pendingTrends = await prisma.trend.findMany({
    where: { approved: false, rejected: false, contentGenerated: false },
    orderBy: { trendDate: "desc" },
  });

  for (const trend of pendingTrends) {
    if (!trendQueue.includes(trend.id)) {
      trendQueue.push(trend.id);
    }
  }
  console.info(`Trends enfileiradas: ${trendQueue.length}`);
}

// Função para processar trends da fila (batch de 10)
async function processQueue() {
  const batch = trendQueue.splice(0, 10); // remove até 10 trends da fila
  if (batch.length === 0) return;

  console.info(`Processando batch de ${batch.length} trends...`);

  await Promise.all(batch.map(async (id) => {
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
        },
      });
      console.info(`Trend ${id} processada com sucesso.`);
    } catch (err) {
      console.error(`Erro ao processar trend ${id}:`, err);
    }
  }));
}

// Cron simples: roda a cada 1 minuto
setInterval(async () => {
  try {
    await enqueuePendingTrends();
    await processQueue();
  } catch (err) {
    console.error("Erro no cron do worker:", err);
  }
}, 60 * 1000); // 60s
