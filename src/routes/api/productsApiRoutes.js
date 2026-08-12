// src/routes/api/productsApiRoutes.js
const express = require('express');
const router = express.Router();
const productsApiController = require('../../controllers/api/productsApiController');
const jwtAuthMiddleware = require('../../middlewares/jwtAuthMiddleware');

// Lectura pública de productos
router.get('/', productsApiController.getAll);
router.get('/:id', productsApiController.getById);

// Operaciones protegidas (requieren Token JWT)
router.post('/', jwtAuthMiddleware, productsApiController.create);
router.put('/:id', jwtAuthMiddleware, productsApiController.update);
router.delete('/:id', jwtAuthMiddleware, productsApiController.delete);

module.exports = router;