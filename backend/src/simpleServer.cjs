const express = require('express');
const jwt = require('jsonwebtoken');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();

// Conectar ao banco SQLite
const dbPath = path.join(__dirname, '../../prisma/dev.db');
const db = new sqlite3.Database(dbPath);

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

  // Salvar login no banco
  db.run(
    'INSERT INTO LoginLog (userId, action, ip, device, createdAt) VALUES (?, ?, ?, ?, ?)',
    [user.id, 'login', req.ip || 'unknown', req.headers['user-agent'] || 'unknown', new Date().toISOString()],
    (err) => {
      if (err) {
        console.log('⚠️ Erro ao salvar login:', err.message);
      }
    }
  );

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
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (token) {
    try {
      const decoded = jwt.verify(token, "trendly_secret");
      db.run(
        'INSERT INTO LoginLog (userId, action, ip, device, createdAt) VALUES (?, ?, ?, ?, ?)',
        [decoded.id, 'logout', req.ip || 'unknown', req.headers['user-agent'] || 'unknown', new Date().toISOString()],
        (err) => {
          if (err) {
            console.log('⚠️ Erro ao salvar logout:', err.message);
          }
        }
      );
    } catch (error) {
      console.log('⚠️ Token inválido no logout:', error.message);
    }
  }
  
  res.json({ message: "Logout realizado com sucesso" });
});

// Rotas públicas para trends
app.get('/public/google/top-clicks', (req, res) => {
  db.all(
    `SELECT * FROM Trend 
     WHERE source = 'google' AND approved = 1 AND contentGenerated = 1 
     ORDER BY searchVolume DESC 
     LIMIT 10`,
    (err, rows) => {
      if (err) {
        console.log('⚠️ Erro ao buscar trends:', err.message);
        res.json({ items: [], total: 0 });
        return;
      }
      res.json({ items: rows, total: rows.length });
    }
  );
});

app.get('/public/google/top-trends', (req, res) => {
  db.all(
    `SELECT * FROM Trend 
     WHERE source = 'google' AND approved = 1 AND contentGenerated = 1 
     ORDER BY growthPercent DESC 
     LIMIT 10`,
    (err, rows) => {
      if (err) {
        console.log('⚠️ Erro ao buscar trends:', err.message);
        res.json({ items: [], total: 0 });
        return;
      }
      res.json({ items: rows, total: rows.length });
    }
  );
});

// Rotas admin para trends
app.get('/admin/trends/pending', (req, res) => {
  db.all(
    `SELECT * FROM Trend 
     WHERE approved = 0 AND rejected = 0 AND contentGenerated = 1 
     ORDER BY createdAt DESC 
     LIMIT 20`,
    (err, rows) => {
      if (err) {
        console.log('⚠️ Erro ao buscar trends pendentes:', err.message);
        res.json({ items: [], total: 0 });
        return;
      }
      res.json({ items: rows, total: rows.length });
    }
  );
});

// Rota que retorna usuários com contagem de logins
app.get('/admin/users', (req, res) => {
  db.all(
    `SELECT u.*, COUNT(l.id) as loginCount 
     FROM User u 
     LEFT JOIN LoginLog l ON u.id = l.userId 
     GROUP BY u.id 
     ORDER BY u.createdAt DESC`,
    (err, rows) => {
      if (err) {
        console.log('⚠️ Erro ao buscar usuários:', err.message);
        res.json({ users: [] });
        return;
      }
      
      const users = rows.map(row => ({
        id: row.id,
        facebookId: row.facebookId,
        name: row.name,
        picture: row.picture,
        role: row.role,
        status: row.status,
        createdAt: row.createdAt,
        _count: {
          LoginLogs: row.loginCount
        }
      }));
      
      res.json({ users });
    }
  );
});

// Rotas admin para trends (ações)
app.post('/admin/trends/:id/approve', (req, res) => {
  const trendId = req.params.id;
  console.log(`✅ Aprovando trend ${trendId}`);
  
  db.run(
    'UPDATE Trend SET approved = 1, publishedAt = ? WHERE id = ?',
    [new Date().toISOString(), trendId],
    (err) => {
      if (err) {
        console.log('⚠️ Erro ao aprovar trend:', err.message);
        return res.status(500).json({ error: "Erro interno do servidor" });
      }
      res.json({ message: "Trend aprovada com sucesso!" });
    }
  );
});

app.post('/admin/trends/:id/reject', (req, res) => {
  const trendId = req.params.id;
  console.log(`❌ Rejeitando trend ${trendId}`);
  
  db.run(
    'UPDATE Trend SET rejected = 1 WHERE id = ?',
    [trendId],
    (err) => {
      if (err) {
        console.log('⚠️ Erro ao rejeitar trend:', err.message);
        return res.status(500).json({ error: "Erro interno do servidor" });
      }
      res.json({ message: "Trend rejeitada com sucesso!" });
    }
  );
});

app.post('/admin/trends/:id/rewrite', (req, res) => {
  const trendId = req.params.id;
  console.log(`🤖 Reescrevendo trend ${trendId} via IA`);
  
  // Simular reescrita via IA
  const newTitle = `Trend Reescrita via IA #${trendId}`;
  const newSummary = `Conteúdo reescrito pela inteligência artificial em ${new Date().toLocaleString()}`;
  
  db.run(
    'UPDATE Trend SET title = ?, summary = ?, contentGenerated = 1, rewriteRequested = 1 WHERE id = ?',
    [newTitle, newSummary, trendId],
    (err) => {
      if (err) {
        console.log('⚠️ Erro ao reescrever trend:', err.message);
        return res.status(500).json({ error: "Erro interno do servidor" });
      }
      
      res.json({ 
        message: "Trend reescrita com sucesso!",
        trend: {
          id: parseInt(trendId),
          title: newTitle,
          summary: newSummary,
          contentGenerated: true
        }
      });
    }
  );
});

app.post('/admin/trends/:id/delete', (req, res) => {
  const trendId = req.params.id;
  console.log(`🗑️ Deletando trend ${trendId}`);
  
  db.run(
    'UPDATE Trend SET visibleToAdmin = 0 WHERE id = ?',
    [trendId],
    (err) => {
      if (err) {
        console.log('⚠️ Erro ao deletar trend:', err.message);
        return res.status(500).json({ error: "Erro interno do servidor" });
      }
      res.json({ message: "Trend removida com sucesso!" });
    }
  );
});

// Rotas admin para usuários (ações)
app.patch('/admin/users/:id/role', (req, res) => {
  const { role } = req.body;
  const userId = req.params.id;
  console.log(`👤 Alterando role do usuário ${userId} para ${role}`);
  
  db.run(
    'UPDATE User SET role = ? WHERE id = ?',
    [role, userId],
    (err) => {
      if (err) {
        console.log('⚠️ Erro ao atualizar role:', err.message);
        return res.status(500).json({ error: "Erro interno do servidor" });
      }
      
      res.json({ 
        message: `Role do usuário alterada para ${role} com sucesso!`,
        user: { id: parseInt(userId), role: role }
      });
    }
  );
});

app.patch('/admin/users/:id/status', (req, res) => {
  const { status } = req.body;
  const userId = req.params.id;
  console.log(`👤 Alterando status do usuário ${userId} para ${status}`);
  
  db.run(
    'UPDATE User SET status = ? WHERE id = ?',
    [status, userId],
    (err) => {
      if (err) {
        console.log('⚠️ Erro ao atualizar status:', err.message);
        return res.status(500).json({ error: "Erro interno do servidor" });
      }
      
      res.json({ 
        message: `Status do usuário alterado para ${status} com sucesso!`,
        user: { id: parseInt(userId), status: status }
      });
    }
  );
});

app.delete('/admin/users/:id', (req, res) => {
  const userId = req.params.id;
  console.log(`🗑️ Deletando usuário ${userId}`);
  
  db.run(
    'DELETE FROM User WHERE id = ?',
    [userId],
    (err) => {
      if (err) {
        console.log('⚠️ Erro ao deletar usuário:', err.message);
        return res.status(500).json({ error: "Erro interno do servidor" });
      }
      
      res.json({ 
        message: "Usuário deletado com sucesso!"
      });
    }
  );
});

app.listen(4000, () => {
  console.log("🚀 Servidor simples com SQLite rodando em http://localhost:4000");
  console.log("📊 Banco: SQLite direto");
  console.log("✅ Todas as rotas admin implementadas");
});