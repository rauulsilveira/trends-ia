const { execSync } = require('child_process');

try {
  console.log('🔧 Tentando corrigir Prisma...');
  
  // Instalar Prisma CLI globalmente
  execSync('npm install -g prisma', { stdio: 'inherit' });
  
  // Gerar cliente Prisma
  execSync('npx prisma generate --schema=../prisma/schema.prisma', { stdio: 'inherit' });
  
  console.log('✅ Prisma corrigido!');
} catch (error) {
  console.error('❌ Erro ao corrigir Prisma:', error.message);
}

