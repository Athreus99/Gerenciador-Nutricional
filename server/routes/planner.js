const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Middleware de autenticação
router.use(authController.authenticateToken);

// Rotas temporárias
router.get('/:userId/:startDate/:endDate', (req, res) => {
  res.json([]);
});

router.get('/:userId/shopping-list', (req, res) => {
  res.json([]);
});

module.exports = router;