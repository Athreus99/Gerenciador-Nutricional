const express = require('express');
const cors = require('cors');
const path = require('path');
const morgan = require('morgan');
const { createTables } = require('./init-db');
const db = require('./db/database');

// Importar rotas
const authRoutes = require('./routes/auth');
const diaryRoutes = require('./routes/diary');
const recipeRoutes = require('./routes/recipes');
const plannerRoutes = require('./routes/planner');
const foodRoutes = require('./routes/foods');

// Inicializar app Express
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware de CORS
const corsOptions = {
  origin: process.env.NODE_ENV === 'production'
    ? ['https://gerenciador-nutricional.vercel.app'] // URL do frontend
    : '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
};
app.use(cors(corsOptions));

// Outros middlewares
app.use(express.json());
app.use(morgan('dev'));

// Rotas da API
app.use('/api/auth', authRoutes);
app.use('/api/diary', diaryRoutes);
app.use('/api/recipes', recipeRoutes);
app.use('/api/planner', plannerRoutes);
app.use('/api/foods', foodRoutes);

// Inicializar banco de dados
function initDb() {
  return new Promise((resolve, reject) => {
    // Criar tabelas se não existirem
    db.serialize(() => {
      // Tabela de usuários
      db.run(`
        CREATE TABLE IF NOT EXISTS usuarios (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          nome TEXT NOT NULL,
          email TEXT UNIQUE NOT NULL,
          senha TEXT NOT NULL,
          data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Tabela de alimentos
      db.run(`
        CREATE TABLE IF NOT EXISTS alimentos (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          nome TEXT NOT NULL,
          calorias INTEGER NOT NULL,
          proteinas REAL,
          carboidratos REAL,
          gorduras REAL,
          porcao TEXT
        )
      `);

      // Tabela de diário alimentar
      db.run(`
        CREATE TABLE IF NOT EXISTS diario_alimentar (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          usuario_id INTEGER NOT NULL,
          data DATE NOT NULL,
          tipo_refeicao TEXT NOT NULL,
          alimento_id INTEGER,
          receita_id INTEGER,
          quantidade REAL NOT NULL,
          FOREIGN KEY (usuario_id) REFERENCES usuarios (id),
          FOREIGN KEY (alimento_id) REFERENCES alimentos (id),
          FOREIGN KEY (receita_id) REFERENCES receitas (id)
        )
      `);

      // Tabela de receitas
      db.run(`
        CREATE TABLE IF NOT EXISTS receitas (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          nome TEXT NOT NULL,
          descricao TEXT,
          tipo_refeicao TEXT NOT NULL,
          tempo_preparo INTEGER,
          porcoes INTEGER,
          calorias_totais INTEGER,
          imagem_url TEXT
        )
      `);

      // Tabela de ingredientes da receita
      db.run(`
        CREATE TABLE IF NOT EXISTS receita_ingredientes (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          receita_id INTEGER NOT NULL,
          alimento_id INTEGER NOT NULL,
          quantidade REAL NOT NULL,
          unidade TEXT NOT NULL,
          FOREIGN KEY (receita_id) REFERENCES receitas (id),
          FOREIGN KEY (alimento_id) REFERENCES alimentos (id)
        )
      `);

      // Tabela de planejamento de refeições
      db.run(`
        CREATE TABLE IF NOT EXISTS planejamento_refeicoes (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          usuario_id INTEGER NOT NULL,
          data DATE NOT NULL,
          tipo_refeicao TEXT NOT NULL,
          receita_id INTEGER,
          FOREIGN KEY (usuario_id) REFERENCES usuarios (id),
          FOREIGN KEY (receita_id) REFERENCES receitas (id)
        )
      `);

      // Tabela de lista de compras
      db.run(`
        CREATE TABLE IF NOT EXISTS lista_compras (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          usuario_id INTEGER NOT NULL,
          alimento_id INTEGER NOT NULL,
          quantidade REAL NOT NULL,
          unidade TEXT NOT NULL,
          comprado BOOLEAN DEFAULT 0,
          FOREIGN KEY (usuario_id) REFERENCES usuarios (id),
          FOREIGN KEY (alimento_id) REFERENCES alimentos (id)
        )
      `, err => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  });
}

// Iniciar servidor
async function startServer() {
  try {
    // Inicializar o banco de dados
    await createTables();
    console.log('Banco de dados inicializado com sucesso!');
    
    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  } catch (error) {
    console.error('Erro ao inicializar o banco de dados:', error);
    process.exit(1);
  }
}

startServer();
// Lidar com o encerramento do processo
process.on('SIGINT', () => {
  db.close(err => {
    if (err) {
      console.error('Erro ao fechar o banco de dados:', err);
    } else {
      console.log('Conexão com o banco de dados fechada');
    }
    process.exit(err ? 1 : 0);
  });
});
