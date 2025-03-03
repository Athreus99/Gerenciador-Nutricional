const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db/database');

// Configuração JWT
const JWT_SECRET = process.env.JWT_SECRET || 'seu_secret_jwt_aqui';
const JWT_EXPIRES_IN = '7d';

// Registrar usuário
exports.register = async (req, res) => {
  const { nome, email, senha } = req.body;
  
  try {
    // Verificar se o email já existe
    const userExists = await new Promise((resolve, reject) => {
      db.get('SELECT id FROM usuarios WHERE email = ?', [email], (err, row) => {
        if (err) reject(err);
        resolve(row);
      });
    });
    
    if (userExists) {
      return res.status(400).json({ message: 'Email já cadastrado' });
    }
    
    // Hash da senha
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(senha, salt);
    
    // Inserir usuário no banco
    await new Promise((resolve, reject) => {
      db.run(
        'INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)',
        [nome, email, hashedPassword],
        function(err) {
          if (err) reject(err);
          resolve(this.lastID);
        }
      );
    });
    
    res.status(201).json({ message: 'Usuário registrado com sucesso' });
  } catch (error) {
    console.error('Erro ao registrar usuário:', error);
    res.status(500).json({ message: 'Erro ao registrar usuário' });
  }
};

// Login de usuário
exports.login = async (req, res) => {
  const { email, senha } = req.body;
  
  try {
    // Buscar usuário pelo email
    const user = await new Promise((resolve, reject) => {
      db.get('SELECT * FROM usuarios WHERE email = ?', [email], (err, row) => {
        if (err) reject(err);
        resolve(row);
      });
    });
    
    if (!user) {
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }
    
    // Verificar senha
    const isMatch = await bcrypt.compare(senha, user.senha);
    
    if (!isMatch) {
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }
    
    // Gerar token JWT
    const token = jwt.sign(
      { id: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );
    
    res.json({
      message: 'Login realizado com sucesso',
      token,
      userId: user.id
    });
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    res.status(500).json({ message: 'Erro ao fazer login' });
  }
};

// Middleware de autenticação
exports.authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'Token não fornecido' });
  }
  
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Token inválido' });
    }
    
    req.user = user;
    next();
  });
};