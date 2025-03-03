const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Middleware de autenticação
router.use(authController.authenticateToken);

// Rotas temporárias
router.get('/', (req, res) => {
  res.json([]);
});

router.get('/:id', (req, res) => {
  res.json({});
});

module.exports = router;