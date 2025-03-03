const db = require('../db/database');

// Obter entradas do diário para um dia específico
exports.getDailyEntries = (req, res) => {
  const userId = req.params.userId;
  const date = req.params.date;
  
  // Verificar se o usuário que faz a requisição é o mesmo do token
  if (req.user.id != userId) {
    return res.status(403).json({ message: 'Acesso não autorizado' });
  }
  
  db.all(
    `SELECT d.*, 
            a.nome as alimento_nome, 
            r.nome as receita_nome,
            CASE 
              WHEN d.alimento_id IS NOT NULL THEN (a.calorias * d.quantidade)
              WHEN d.receita_id IS NOT NULL THEN (r.calorias_totais * d.quantidade)
              ELSE 0
            END as calorias
     FROM diario_alimentar d
     LEFT JOIN alimentos a ON d.alimento_id = a.id
     LEFT JOIN receitas r ON d.receita_id = r.id
     WHERE d.usuario_id = ? AND d.data = ?
     ORDER BY d.tipo_refeicao, d.id`,
    [userId, date],
    (err, rows) => {
      if (err) {
        console.error('Erro ao buscar entradas do diário:', err);
        return res.status(500).json({ message: 'Erro ao buscar entradas do diário' });
      }
      
      res.json(rows);
    }
  );
};

// Obter resumo nutricional do dia
exports.getDailySummary = (req, res) => {
  const userId = req.params.userId;
  const date = req.params.date;
  
  // Verificar se o usuário que faz a requisição é o mesmo do token
  if (req.user.id != userId) {
    return res.status(403).json({ message: 'Acesso não autorizado' });
  }
  
  // Consulta para calcular o total de calorias, proteínas, carboidratos e gorduras do dia
  const query = `
    SELECT 
      SUM(CASE 
        WHEN d.alimento_id IS NOT NULL THEN (a.calorias * d.quantidade)
        WHEN d.receita_id IS NOT NULL THEN (r.calorias_totais * d.quantidade)
        ELSE 0
      END) as totalCalorias,
      
      SUM(CASE
        WHEN d.alimento_id IS NOT NULL THEN (a.proteinas * d.quantidade)
        ELSE 0
      END) as totalProteinas,
      
      SUM(CASE
        WHEN d.alimento_id IS NOT NULL THEN (a.carboidratos * d.quantidade)
        ELSE 0
      END) as totalCarboidratos,
      
      SUM(CASE
        WHEN d.alimento_id IS NOT NULL THEN (a.gorduras * d.quantidade)
        ELSE 0
      END) as totalGorduras
      
    FROM diario_alimentar d
    LEFT JOIN alimentos a ON d.alimento_id = a.id
    LEFT JOIN receitas r ON d.receita_id = r.id
    WHERE d.usuario_id = ? AND d.data = ?
  `;
  
  db.get(query, [userId, date], (err, summary) => {
    if (err) {
      console.error('Erro ao calcular resumo diário:', err);
      return res.status(500).json({ message: 'Erro ao calcular resumo diário' });
    }
    
    // Garantir que os valores não sejam nulos
    res.json({
      totalCalorias: Math.round(summary.totalCalorias || 0),
      totalProteinas: Math.round((summary.totalProteinas || 0) * 10) / 10,
      totalCarboidratos: Math.round((summary.totalCarboidratos || 0) * 10) / 10,
      totalGorduras: Math.round((summary.totalGorduras || 0) * 10) / 10
    });
  });
};

// Adicionar entrada ao diário
exports.addEntry = (req, res) => {
  const { usuario_id, data, tipo_refeicao, alimento_id, receita_id, quantidade } = req.body;
  
  // Verificar se o usuário que faz a requisição é o mesmo do token
  if (req.user.id != usuario_id) {
    return res.status(403).json({ message: 'Acesso não autorizado' });
  }
  
  // Verificar se foi fornecido alimento ou receita
  if (!alimento_id && !receita_id) {
    return res.status(400).json({ message: 'Alimento ou receita deve ser fornecido' });
  }
  
  db.run(
    `INSERT INTO diario_alimentar (usuario_id, data, tipo_refeicao, alimento_id, receita_id, quantidade) 
     VALUES (?, ?, ?, ?, ?, ?)`,
    [usuario_id, data, tipo_refeicao, alimento_id, receita_id, quantidade],
    function(err) {
      if (err) {
        console.error('Erro ao adicionar entrada no diário:', err);
        return res.status(500).json({ message: 'Erro ao adicionar entrada no diário' });
      }
      
      res.status(201).json({ 
        id: this.lastID,
        message: 'Entrada adicionada com sucesso' 
      });
    }
  );
};

// Atualizar entrada do diário
exports.updateEntry = (req, res) => {
  const entryId = req.params.id;
  const { tipo_refeicao, alimento_id, receita_id, quantidade } = req.body;
  
  // Primeiro, verificar se a entrada pertence ao usuário autenticado
  db.get(
    'SELECT usuario_id FROM diario_alimentar WHERE id = ?',
    [entryId],
    (err, row) => {
      if (err) {
        console.error('Erro ao verificar entrada do diário:', err);
        return res.status(500).json({ message: 'Erro ao atualizar entrada do diário' });
      }
      
      if (!row) {
        return res.status(404).json({ message: 'Entrada não encontrada' });
      }
      
      // Verificar se o usuário que faz a requisição é o dono da entrada
      if (req.user.id != row.usuario_id) {
        return res.status(403).json({ message: 'Acesso não autorizado' });
      }
      
      // Atualizar a entrada
      db.run(
        `UPDATE diario_alimentar 
         SET tipo_refeicao = ?, alimento_id = ?, receita_id = ?, quantidade = ? 
         WHERE id = ?`,
        [tipo_refeicao, alimento_id, receita_id, quantidade, entryId],
        function(err) {
          if (err) {
            console.error('Erro ao atualizar entrada do diário:', err);
            return res.status(500).json({ message: 'Erro ao atualizar entrada do diário' });
          }
          
          if (this.changes === 0) {
            return res.status(404).json({ message: 'Entrada não encontrada' });
          }
          
          res.json({ message: 'Entrada atualizada com sucesso' });
        }
      );
    }
  );
};

// Remover entrada do diário
exports.deleteEntry = (req, res) => {
  const entryId = req.params.id;
  
  // Primeiro, verificar se a entrada pertence ao usuário autenticado
  db.get(
    'SELECT usuario_id FROM diario_alimentar WHERE id = ?',
    [entryId],
    (err, row) => {
      if (err) {
        console.error('Erro ao verificar entrada do diário:', err);
        return res.status(500).json({ message: 'Erro ao remover entrada do diário' });
      }
      
      if (!row) {
        return res.status(404).json({ message: 'Entrada não encontrada' });
      }
      
      // Verificar se o usuário que faz a requisição é o dono da entrada
      if (req.user.id != row.usuario_id) {
        return res.status(403).json({ message: 'Acesso não autorizado' });
      }
      
      // Remover a entrada
      db.run(
        'DELETE FROM diario_alimentar WHERE id = ?',
        [entryId],
        function(err) {
          if (err) {
            console.error('Erro ao remover entrada do diário:', err);
            return res.status(500).json({ message: 'Erro ao remover entrada do diário' });
          }
          
          res.json({ message: 'Entrada removida com sucesso' });
        }
      );
    }
  );
};