# Script para iniciar o ambiente de desenvolvimento
# Uso: .\start-dev.ps1 [opção]
# Opções:
#   all     - Backend + Frontend (padrão)
#   full    - Backend + Frontend + Worker
#   crawl   - Executar crawler do Google
#   setup   - Instalar dependências

param(
    [string]$mode = "all"
)

Write-Host "🚀 Iniciando Trends IA - Modo: $mode" -ForegroundColor Green

switch ($mode) {
    "setup" {
        Write-Host "📦 Instalando dependências..." -ForegroundColor Yellow
        npm run setup
        Write-Host "✅ Setup concluído!" -ForegroundColor Green
    }
    "all" {
        Write-Host "🔄 Iniciando Backend + Frontend..." -ForegroundColor Yellow
        npm run dev
    }
    "full" {
        Write-Host "🔄 Iniciando Backend + Frontend + Worker..." -ForegroundColor Yellow
        npm run dev:full
    }
    "crawl" {
        Write-Host "🕷️ Executando crawler do Google..." -ForegroundColor Yellow
        npm run crawl:google
    }
    default {
        Write-Host "❌ Modo inválido. Use: all, full, crawl ou setup" -ForegroundColor Red
        exit 1
    }
}

