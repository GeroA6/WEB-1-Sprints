const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

router.get('/:id', productController.getDetail);

// Delegamos la petición POST directamente al controlador
router.post('/new', productController.createProduct);


module.exports = router;