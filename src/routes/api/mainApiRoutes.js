// ========================================================================
// ENRUTADOR PRINCIPAL DE LA API
// ========================================================================

const express = require('express');
const router = express.Router();

const mainApiController = require('../../controllers/api/mainApiController');

// Ruta principal de la API
router.get('/', mainApiController.index);

module.exports = router;
