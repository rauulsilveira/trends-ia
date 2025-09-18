import prisma from "./prismaClient.js";

async function main() {
  // Garantir que o Raul seja admin
  await prisma.user.upsert({
    where: { facebookId: 'raul_admin' },
    update: { role: 'admin', status: 'ativo' },
    create: {
      facebookId: 'raul_admin',
      name: 'Raul Silveira',
      picture: null,
      role: 'admin',
      status: 'ativo'
    }
  });

  console.log('✅ Seed executado: Raul Silveira configurado como admin');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
