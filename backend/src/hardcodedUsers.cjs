const express = require('express');
const jwt = require('jsonwebtoken');

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

// Rota de login com Facebook
app.post('/auth/facebook', (req, res) => {
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

  // Gerar JWT
  const token = jwt.sign(
    { id: user.id, role: user.role },
    "trendly_secret",
    { expiresIn: "7d" }
  );

  res.json({ token, user });
});

// Rota de logout
app.post('/auth/logout', (req, res) => {
  res.json({ message: "Logout realizado com sucesso" });
});

// Rotas públicas para trends
app.get('/public/google/top-clicks', (req, res) => {
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
      },
      {
        id: 2,
        title: "Tendência Google 2",
        summary: "Outra tendência popular do Google",
        thumbnail: "https://via.placeholder.com/300x200/22c55e/ffffff?text=Google+Trend",
        tags: "google,news,popular",
        source: "google",
        searchVolume: 12000,
        growthPercent: 18.3,
        publishedAt: new Date().toISOString()
      }
    ],
    total: 2
  });
});

app.get('/public/google/top-trends', (req, res) => {
  res.json({
    items: [
      {
        id: 3,
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
app.get('/admin/trends/pending', (req, res) => {
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

app.post('/admin/trends/:id/approve', (req, res) => {
  res.json({ message: "Trend aprovada com sucesso!" });
});

app.post('/admin/trends/:id/reject', (req, res) => {
  res.json({ message: "Trend rejeitada com sucesso!" });
});

app.post('/admin/trends/:id/rewrite', (req, res) => {
  res.json({ 
    message: "Trend reescrita com sucesso!",
    trend: {
      id: parseInt(req.params.id),
      title: "Trend Reescrita via IA",
      summary: "Conteúdo reescrito pela inteligência artificial",
      contentGenerated: true
    }
  });
});

app.post('/admin/trends/:id/delete', (req, res) => {
  res.json({ message: "Trend removida com sucesso!" });
});

// Rota que retorna usuários com _count hardcoded
app.get('/admin/users', (req, res) => {
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
  console.log("🚀 Servidor com usuários hardcoded rodando em http://localhost:4000");
  console.log("📊 Teste: http://localhost:4000/admin/users");
});
