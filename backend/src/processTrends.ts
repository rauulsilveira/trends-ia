import prisma from "./prismaClient.js";
import { generateTrendContent } from "./aiProcessor.js";

async function main() {
  const trends = await prisma.trend.findMany({
    where: { contentGenerated: false },
    orderBy: { trendDate: "desc" },
    take: 10 // processa 10 por vez, ajusta se quiser
  });

  for (const trend of trends) {
    await generateTrendContent(trend.id, trend.title);
  }

  console.log("✅ Processamento IA finalizado");
  await prisma.$disconnect();
}

main();
