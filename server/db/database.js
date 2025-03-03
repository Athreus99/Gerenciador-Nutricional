const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// Determinar o ambiente
const isProduction = process.env.NODE_ENV === 'production';

// Definir o caminho do banco de dados baseado no ambiente
const dbPath = isProduction
  ? path.resolve(__dirname, '../../data/food_management.db') // Produção
  : path.resolve(__dirname, './food_management.db');         // Desenvolvimento

console.log(`Usando banco de dados: ${dbPath}`);

// Garantir que o diretório exista
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
  console.log(`Criando diretório para o banco de dados: ${dbDir}`);
  fs.mkdirSync(dbDir, { recursive: true });
}

// Criar conexão com o banco de dados
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados SQLite:', err);
  } else {
    console.log('Conectado ao banco de dados SQLite');
  }
});

module.exports = db;