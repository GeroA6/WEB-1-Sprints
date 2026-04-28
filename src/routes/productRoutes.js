const express = require('express');
const router = express.Router();

// Importamos el controlador de productos que acabamos de crear.
const productController = require('../controllers/productController');

// Definimos la ruta para el detalle de un producto.
// Express entenderá que ':id' es un parámetro dinámico.
router.get('/:id', productController.getDetail);


module.exports = router;