// prisma/seed.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Inserindo dados fake…");

  // Apaga todos os registros antes de popular
  await prisma.trend.deleteMany();
  console.log("🧹 Tabela trends limpa");

  await prisma.trend.createMany({
    data: [
      {
        title: "Nova expansão de jogo X",
        summary: "Jogo X lançou uma expansão cheia de novas fases e personagens.",
        url: "https://exemplo.com/noticia/jogo-x",
        thumbnail: "https://via.placeholder.com/150",
        tags: JSON.stringify(["games", "expansão", "lançamento"]),
        source: "seed",
        trendDate: new Date(),
        processedAt: new Date(),
        approved: false,
        rejected: false,
        rewriteRequested: false,
      },
      {
        title: "Jogo Y bate recorde de players online",
        summary: "O jogo Y registrou mais de 1 milhão de jogadores simultâneos.",
        url: "https://exemplo.com/noticia/jogo-y",
        thumbnail: "https://via.placeholder.com/150",
        tags: JSON.stringify(["games", "recorde", "online"]),
        source: "seed",
        trendDate: new Date(),
        processedAt: new Date(),
        approved: false,
        rejected: false,
        rewriteRequested: false,
      },
      {
        title: "Trend já aprovada",
        summary: "Exemplo de trend que já foi aprovada.",
        url: "https://exemplo.com/aprovada",
        thumbnail: "https://via.placeholder.com/150",
        tags: JSON.stringify(["teste", "admin"]),
        source: "seed",
        trendDate: new Date(),
        processedAt: new Date(),
        approved: true,
        rejected: false,
        rewriteRequested: false,
      },
      {
        title: "Trend rejeitada",
        summary: "Exemplo de trend que foi rejeitada.",
        url: "https://exemplo.com/rejeitada",
        thumbnail: "https://via.placeholder.com/150",
        tags: JSON.stringify(["teste", "rejeitada"]),
        source: "seed",
        trendDate: new Date(),
        processedAt: new Date(),
        approved: false,
        rejected: true,
        rewriteRequested: false,
      },
      {
        title: "Trend marcada para reescrita",
        summary: "Exemplo de trend aguardando reescrita pela IA.",
        url: "https://exemplo.com/reescrita",
        thumbnail: "https://via.placeholder.com/150",
        tags: JSON.stringify(["teste", "reescrita"]),
        source: "seed",
        trendDate: new Date(),
        processedAt: new Date(),
        approved: false,
        rejected: false,
        rewriteRequested: true,
      },
    ],
  });

  console.log("✅ Seed finalizado!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
