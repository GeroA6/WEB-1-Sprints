const express = require('express');
const router = express.Router();
const usersApiController = require('../../controllers/api/usersApiController');

// Mapeo de rutas de la API de Usuarios
router.get('/', usersApiController.getAll);
router.get('/:id', usersApiController.getById);
router.post('/', usersApiController.create);
router.put('/:id', usersApiController.update);
router.delete('/:id', usersApiController.delete);

module.exports = router;
