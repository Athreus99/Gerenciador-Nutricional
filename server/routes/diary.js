const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Middleware de autenticação
router.use(authController.authenticateToken);

// Rotas temporárias
router.get('/:userId/:date', (req, res) => {
  res.json([]);
});

router.get('/:userId/:date/summary', (req, res) => {
  res.json({
    totalCalorias: 0,
    totalProteinas: 0,
    totalCarboidratos: 0,
    totalGorduras: 0
  });
});

module.exports = router;