const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

// La ruta real será GET /cart/
router.get('/', cartController.viewCart);

// La ruta real será POST /cart/add/:id
router.post('/add/:id', cartController.addCart);

// La ruta real será POST /cart/clear
router.post('/clear', cartController.clearCart);

module.exports = router;