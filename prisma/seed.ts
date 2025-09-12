import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Remove dados antigos (opcional)
  await prisma.trend.deleteMany();

  // Cria dados de exemplo
  await prisma.trend.createMany({
    data: [
      {
        title: "Nova expansão de jogo X",
        summary: "Jogo X lançou uma expansão cheia de novas fases e personagens.",
        url: "https://exemplo.com/noticia/jogo-x",
        thumbnail: "https://via.placeholder.com/150",
        tags: JSON.stringify(["games", "expansão", "lançamento"])
      },
      {
        title: "Jogo Y bate recorde de players online",
        summary: "O jogo Y registrou mais de 1 milhão de jogadores simultâneos.",
        url: "https://exemplo.com/noticia/jogo-y",
        thumbnail: "https://via.placeholder.com/150",
        tags: JSON.stringify(["games", "recorde", "online"])
      },
      {
        title: "Evento de esports Z acontece neste fim de semana",
        summary: "O campeonato Z terá transmissões ao vivo com grandes equipes.",
        url: "https://exemplo.com/noticia/esports-z",
        thumbnail: "https://via.placeholder.com/150",
        tags: JSON.stringify(["esports", "evento", "transmissão"])
      }
    ]
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
