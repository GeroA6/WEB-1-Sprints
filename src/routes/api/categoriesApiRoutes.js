// src/routes/api/categoriesApiRoutes.js
const express = require('express');
const router = express.Router();
const categoriesApiController = require('../../controllers/api/categoriesApiController');
const jwtAuthMiddleware = require('../../middlewares/jwtAuthMiddleware');

// Lectura pública de categorías
router.get('/', categoriesApiController.getAll);
router.get('/:id', categoriesApiController.getById);

// Operaciones protegidas (requieren Token JWT)
router.post('/', jwtAuthMiddleware, categoriesApiController.create);
router.put('/:id', jwtAuthMiddleware, categoriesApiController.update);
router.delete('/:id', jwtAuthMiddleware, categoriesApiController.delete);

module.exports = router;
