const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

router.get('/', productController.listProducts);

router.get('/:id', productController.getDetail);

//RUTA para React (Devuelve JSON) -> http://localhost:3000/products/api/1
router.get('/api/:id', productController.getDetailApi);
// Delegamos la petición POST directamente al controlador
router.post('/new', productController.createProduct);


module.exports = router;