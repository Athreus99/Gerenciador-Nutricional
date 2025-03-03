const fs = require('fs');
const path = require('path');

// Configuração
const isProduction = process.env.NODE_ENV === 'production';
const dbSourcePath = isProduction
  ? path.resolve(__dirname, '../data/food_management.db')
  : path.resolve(__dirname, './db/food_management.db');

const backupDir = path.resolve(__dirname, '../backups');
const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
const backupPath = path.join(backupDir, `backup-${timestamp}.db`);

// Criar diretório de backup se não existir
if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir, { recursive: true });
}

// Verificar se o arquivo de banco de dados existe
if (!fs.existsSync(dbSourcePath)) {
  console.error(`Erro: Banco de dados não encontrado em ${dbSourcePath}`);
  process.exit(1);
}

// Fazer cópia do banco de dados
try {
  // O SQLite deve estar fechado ou em modo de leitura para backup seguro
  // Uma solução real deveria usar sqlite3 para fazer backup com o banco aberto
  fs.copyFileSync(dbSourcePath, backupPath);
  console.log(`Backup criado com sucesso: ${backupPath}`);
} catch (error) {
  console.error('Erro ao criar backup:', error);
  process.exit(1);
}