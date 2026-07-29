// src/routes/api/productsApiRoutes.js
const express = require('express');
const router = express.Router();
const productsApiController = require('../../controllers/api/productsApiController');

// Definimos las rutas delegando la responsabilidad de respuesta al controlador API
router.get('/', productsApiController.getAll);
router.get('/:id', productsApiController.getById);
router.post('/', productsApiController.create);
router.put('/:id', productsApiController.update);
router.delete('/:id', productsApiController.delete);

module.exports = router;