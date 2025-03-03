const db = require('../db/database');

// Obter todos os alimentos
exports.getAllFoods = (req, res) => {
  db.all('SELECT * FROM alimentos ORDER BY nome', [], (err, rows) => {
    if (err) {
      console.error('Erro ao buscar alimentos:', err);
      return res.status(500).json({ message: 'Erro ao buscar alimentos' });
    }
    
    res.json(rows);
  });
};

// Obter alimento por ID
exports.getFoodById = (req, res) => {
  const foodId = req.params.id;
  
  db.get('SELECT * FROM alimentos WHERE id = ?', [foodId], (err, food) => {
    if (err) {
      console.error('Erro ao buscar alimento:', err);
      return res.status(500).json({ message: 'Erro ao buscar alimento' });
    }
    
    if (!food) {
      return res.status(404).json({ message: 'Alimento não encontrado' });
    }
    
    res.json(food);
  });
};

// Adicionar novo alimento
exports.addFood = (req, res) => {
  const { nome, calorias, proteinas, carboidratos, gorduras, porcao } = req.body;
  
  if (!nome || !calorias) {
    return res.status(400).json({ message: 'Nome e calorias são obrigatórios' });
  }
  
  db.run(
    `INSERT INTO alimentos (nome, calorias, proteinas, carboidratos, gorduras, porcao) 
     VALUES (?, ?, ?, ?, ?, ?)`,
    [nome, calorias, proteinas, carboidratos, gorduras, porcao],
    function(err) {
      if (err) {
        console.error('Erro ao adicionar alimento:', err);
        return res.status(500).json({ message: 'Erro ao adicionar alimento' });
      }
      
      res.status(201).json({ 
        id: this.lastID,
        message: 'Alimento adicionado com sucesso' 
      });
    }
  );
};

// Atualizar alimento
exports.updateFood = (req, res) => {
  const foodId = req.params.id;
  const { nome, calorias, proteinas, carboidratos, gorduras, porcao } = req.body;
  
  if (!nome || !calorias) {
    return res.status(400).json({ message: 'Nome e calorias são obrigatórios' });
  }
  
  db.run(
    `UPDATE alimentos 
     SET nome = ?, calorias = ?, proteinas = ?, carboidratos = ?, gorduras = ?, porcao = ? 
     WHERE id = ?`,
    [nome, calorias, proteinas, carboidratos, gorduras, porcao, foodId],
    function(err) {
      if (err) {
        console.error('Erro ao atualizar alimento:', err);
        return res.status(500).json({ message: 'Erro ao atualizar alimento' });
      }
      
      if (this.changes === 0) {
        return res.status(404).json({ message: 'Alimento não encontrado' });
      }
      
      res.json({ message: 'Alimento atualizado com sucesso' });
    }
  );
};

// Remover alimento
exports.deleteFood = (req, res) => {
  const foodId = req.params.id;
  
  db.run(
    'DELETE FROM alimentos WHERE id = ?',
    [foodId],
    function(err) {
      if (err) {
        console.error('Erro ao remover alimento:', err);
        return res.status(500).json({ message: 'Erro ao remover alimento' });
      }
      
      if (this.changes === 0) {
        return res.status(404).json({ message: 'Alimento não encontrado' });
      }
      
      res.json({ message: 'Alimento removido com sucesso' });
    }
  );
};