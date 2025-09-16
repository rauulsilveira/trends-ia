import { generateTrendContent } from "./aiProcessor.js";
import prisma from "./prismaClient.js";

async function test() {
  // Pega a primeira trend não processada
  const trend = await prisma.trend.findFirst({
    where: { contentGenerated: false }
  });

  if (!trend) {
    console.log("✅ Todas as trends já foram processadas.");
    return;
  }

  console.log(`Processando trend: ${trend.title}`);
  await generateTrendContent(trend.id, trend.title);
  console.log("✅ Teste finalizado");
}

test()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
