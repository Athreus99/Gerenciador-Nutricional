// Script para inicializar o banco de dados
const db = require('./db/database');

// Função para criar as tabelas
function createTables() {
  return new Promise((resolve, reject) => {
    // Executar as queries de criação das tabelas em sequência
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
      
      // Restante das tabelas...
      // [Adicione todas as outras tabelas que você tem]
      
      // Quando todas as tabelas forem criadas
      console.log('Banco de dados inicializado com sucesso!');
      resolve();
    });
  });
}

// Executar e depois fechar a conexão
createTables()
  .then(() => {
    console.log('Inicialização concluída!');
    // Não feche a conexão aqui se o script for importado em outro lugar
    // db.close();
  })
  .catch(err => {
    console.error('Erro ao inicializar banco de dados:', err);
    process.exit(1);
  });

module.exports = { createTables };