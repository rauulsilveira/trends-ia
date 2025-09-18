const express = require('express');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const app = express();

// Middleware para CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  next();
});

// Middleware para parsing JSON
app.use(express.json());

// Tentar conectar com Prisma, se falhar usar mock
let prisma;
try {
  prisma = new PrismaClient();
  console.log('✅ Prisma conectado com sucesso!');
} catch (error) {
  console.log('⚠️ Prisma falhou, usando dados mock:', error.message);
  prisma = null;
}

// Rota de login com Facebook
app.post('/auth/facebook', async (req, res) => {
  const { accessToken } = req.body;
  
  if (!accessToken) {
    return res.status(400).json({ error: "AccessToken não enviado" });
  }

  let user;
  
  // Verificar se é mock login
  if (accessToken === "mock_token_raul") {
    user = {
      id: 3,
      facebookId: "raul_admin",
      name: "Raul Silveira",
      picture: "https://via.placeholder.com/150/3e8cff/ffffff?text=RS",
      role: "admin",
      status: "ativo"
    };
  } else {
    // Login real do Facebook (simulado)
    user = {
      id: 4,
      facebookId: "24808605398764380",
      name: "Raul Silveira",
      picture: "https://platform-lookaside.fbsbx.com/platform/profilepic/?asid=24808605398764380&height=50&width=50&ext=1760821227&hash=AT92BLfQ1Til4X2jgbVW-JoX",
      role: "admin",
      status: "ativo"
    };
  }

  // Se Prisma funcionar, salvar login
  if (prisma) {
    try {
      await prisma.loginLog.create({
        data: {
          userId: user.id,
          action: "login",
          ip: req.ip || req.connection.remoteAddress,
          device: req.headers['user-agent'] || "Unknown"
        }
      });
    } catch (error) {
      console.log('⚠️ Erro ao salvar login:', error.message);
    }
  }

  // Gerar JWT
  const token = jwt.sign(
    { id: user.id, role: user.role },
    "trendly_secret",
    { expiresIn: "7d" }
  );

  res.json({ token, user });
});

// Rota de logout
app.post('/auth/logout', async (req, res) => {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (token && prisma) {
    try {
      const decoded = jwt.verify(token, "trendly_secret");
      await prisma.loginLog.create({
        data: {
          userId: decoded.id,
          action: "logout",
          ip: req.ip || req.connection.remoteAddress,
          device: req.headers['user-agent'] || "Unknown"
        }
      });
    } catch (error) {
      console.log('⚠️ Erro ao salvar logout:', error.message);
    }
  }
  
  res.json({ message: "Logout realizado com sucesso" });
});

// Rotas públicas para trends
app.get('/public/google/top-clicks', async (req, res) => {
  if (prisma) {
    try {
      const trends = await prisma.trend.findMany({
        where: {
          source: "google",
          approved: true,
          contentGenerated: true
        },
        orderBy: { searchVolume: 'desc' },
        take: 10
      });
      
      res.json({ items: trends, total: trends.length });
      return;
    } catch (error) {
      console.log('⚠️ Erro ao buscar trends do banco:', error.message);
    }
  }
  
  // Fallback para mock
  res.json({
    items: [
      {
        id: 1,
        title: "Tendência Google 1",
        summary: "Resumo da tendência mais clicada",
        thumbnail: "https://via.placeholder.com/300x200/3e8cff/ffffff?text=Google+Trend",
        tags: "google,tech,trending",
        source: "google",
        searchVolume: 15000,
        growthPercent: 25.5,
        publishedAt: new Date().toISOString()
      }
    ],
    total: 1
  });
});

app.get('/public/google/top-trends', async (req, res) => {
  if (prisma) {
    try {
      const trends = await prisma.trend.findMany({
        where: {
          source: "google",
          approved: true,
          contentGenerated: true
        },
        orderBy: { growthPercent: 'desc' },
        take: 10
      });
      
      res.json({ items: trends, total: trends.length });
      return;
    } catch (error) {
      console.log('⚠️ Erro ao buscar trends do banco:', error.message);
    }
  }
  
  // Fallback para mock
  res.json({
    items: [
      {
        id: 2,
        title: "Maior Tendência Google",
        summary: "A maior tendência do Google hoje",
        thumbnail: "https://via.placeholder.com/300x200/ef4444/ffffff?text=Top+Trend",
        tags: "google,viral,trending",
        source: "google",
        searchVolume: 25000,
        growthPercent: 45.2,
        publishedAt: new Date().toISOString()
      }
    ],
    total: 1
  });
});

// Rotas admin para trends
app.get('/admin/trends/pending', async (req, res) => {
  if (prisma) {
    try {
      const trends = await prisma.trend.findMany({
        where: {
          approved: false,
          rejected: false,
          contentGenerated: true
        },
        orderBy: { createdAt: 'desc' },
        take: 20
      });
      
      res.json({ items: trends, total: trends.length });
      return;
    } catch (error) {
      console.log('⚠️ Erro ao buscar trends pendentes:', error.message);
    }
  }
  
  // Fallback para mock
  res.json({
    items: [
      {
        id: 4,
        title: "Trend Pendente 1",
        summary: "Trend aguardando aprovação",
        thumbnail: "https://via.placeholder.com/300x200/6b7280/ffffff?text=Pending",
        tags: "pending,review",
        source: "google",
        approved: false,
        rejected: false,
        contentGenerated: true,
        createdAt: new Date().toISOString()
      }
    ],
    total: 1
  });
});

// Rota que retorna usuários com _count
app.get('/admin/users', async (req, res) => {
  if (prisma) {
    try {
      const users = await prisma.user.findMany({
        orderBy: { createdAt: "desc" },
        include: {
          _count: {
            select: { LoginLogs: true }
          }
        }
      });
      
      res.json({ users });
      return;
    } catch (error) {
      console.log('⚠️ Erro ao buscar usuários do banco:', error.message);
    }
  }
  
  // Fallback para mock
  const users = [
    {
      id: 1,
      facebookId: "123456789",
      name: "Raul Silveira",
      role: "user",
      status: "ativo",
      createdAt: "2025-09-12T22:36:28.361Z",
      _count: { LoginLogs: 1 }
    },
    {
      id: 2,
      facebookId: "mock123",
      name: "Usuário Mock",
      role: "user",
      status: "bloqueado",
      createdAt: "2025-09-16T15:45:28.413Z",
      _count: { LoginLogs: 1 }
    },
    {
      id: 3,
      facebookId: "raul_admin",
      name: "Raul Silveira",
      role: "admin",
      status: "ativo",
      createdAt: "2025-09-18T19:53:33.599Z",
      _count: { LoginLogs: 0 }
    },
    {
      id: 4,
      facebookId: "24808605398764380",
      name: "Raul Silveira",
      role: "admin",
      status: "ativo",
      createdAt: "2025-09-18T20:03:16.992Z",
      _count: { LoginLogs: 3 }
    }
  ];

  res.json({ users });
});

app.listen(4000, () => {
  console.log("🚀 Servidor híbrido rodando em http://localhost:4000");
  console.log("📊 Prisma:", prisma ? "✅ Conectado" : "⚠️ Mock");
});

