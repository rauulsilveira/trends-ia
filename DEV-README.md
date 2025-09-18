# 🚀 Trends IA - Scripts de Desenvolvimento

## Início Rápido

### 1. Setup Inicial (primeira vez)
```bash
# Instalar dependências de todos os projetos
npm run setup
```

### 2. Desenvolvimento

#### Opção A: PowerShell (Recomendado para Windows)
```powershell
# Backend + Frontend
.\start-dev.ps1

# Backend + Frontend + Worker (processamento automático)
.\start-dev.ps1 full

# Apenas crawler do Google
.\start-dev.ps1 crawl

# Setup inicial
.\start-dev.ps1 setup
```

#### Opção B: NPM Scripts
```bash
# Backend + Frontend
npm run dev

# Backend + Frontend + Worker
npm run dev:full

# Apenas crawler do Google
npm run crawl:google

# Apenas worker
npm run worker
```

## 📋 Comandos Disponíveis

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Backend + Frontend |
| `npm run dev:full` | Backend + Frontend + Worker |
| `npm run crawl:google` | Executa crawler do Google |
| `npm run worker` | Executa worker de processamento |
| `npm run setup` | Instala todas as dependências |
| `npm run build` | Build de produção |

## 🔧 URLs de Acesso

- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:4000
- **Admin**: http://localhost:3000/admin/trends

## 🎯 Fluxo de Trabalho

1. **Iniciar ambiente**: `.\start-dev.ps1` ou `npm run dev`
2. **Coletar trends**: `.\start-dev.ps1 crawl` ou `npm run crawl:google`
3. **Processar com IA**: Worker roda automaticamente se usar `dev:full`
4. **Aprovar trends**: Acesse http://localhost:3000/admin/trends
5. **Visualizar públicas**: http://localhost:3000/google/mais-clicados

## ⚡ Dicas

- Use `dev:full` para ter processamento automático de IA
- O worker processa trends pendentes a cada 30 segundos
- Trends aprovadas aparecem automaticamente nas páginas públicas
- Admin pode remover trends das páginas públicas (botão 🗑️)

