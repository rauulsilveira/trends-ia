const { execSync } = require('child_process');

try {
  console.log('🔧 Tentando corrigir Prisma...');
  
  // Instalar Prisma CLI
  execSync('npm install prisma @prisma/client', { stdio: 'inherit' });
  
  // Gerar cliente Prisma
  execSync('npx prisma generate --schema=../prisma/schema.prisma', { stdio: 'inherit' });
  
  console.log('✅ Prisma corrigido!');
} catch (error) {
  console.error('❌ Erro ao corrigir Prisma:', error.message);
}