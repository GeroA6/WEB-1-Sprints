const express = require('express');
const router = express.Router(); // Herramienta de Express para manejar rutas fuera de app.js

// Importamos el objeto controlador que contiene la lógica.
const mainController = require('../controllers/mainController');

// Importamos las herramientas para DEFINIR las reglas de validación.
const { check, body } = require('express-validator');

// --- DEFINICIÓN DE RUTAS GET ---
// Para cada ruta, especificamos el método del controlador que debe manejarla.
router.get('/', mainController.getHome);
// router.get('/cart', mainController.getCart);
router.get('/checkout', mainController.getCheckout);
router.get('/login', mainController.getLogin);
router.get('/product', mainController.getProduct);
router.get('/profile', mainController.getProfile);
router.get('/register', mainController.getRegister);
// La ruta real será GET /search?query=...
router.get('/search', mainController.getSearch);
// Ruta dinámica para categorías: GET /categories/:category
router.get('/categories/:category', mainController.getCategory);

// --- DEFINICIÓN DE RUTAS POST ---
// Esta ruta tiene 3 partes: la URL, un array de middlewares de validación, y el método del controlador.
router.post('/register', [
    // 1. Middleware de SANITIZACIÓN: Limpia los datos ANTES de validar.
    body('*').trim(),

    // 2. Middlewares de VALIDACIÓN: Un array de reglas. Si alguna falla, se detiene aquí y no llega al controlador.
    check('nombre').notEmpty().withMessage('El nombre es obligatorio.'),
    check('apellido').notEmpty().withMessage('El apellido es obligatorio.'),
    check('email')
        .notEmpty().withMessage('El email es obligatorio.')
        .isEmail().withMessage('Debes ingresar un correo electrónico válido.'),
    check('password')
        .isLength({ min: 8 }).withMessage('La contraseña debe tener al menos 8 caracteres.'),
        // ... (aquí van el resto de tus reglas de contraseña)

    body('password').custom((value, { req }) => {
        const forbidden = ['password', '1234', 'qwerty', 'negratone', req.body.nombre];
        if (value === req.body.email) {
            throw new Error('La contraseña no puede ser igual a tu email.');
        }
        // ... (aquí van el resto de tus validaciones personalizadas)
        return true; 
    })
], mainController.processRegister); // 3. Si todas las validaciones pasan, se ejecuta este método del controlador.

// Exportamos el router para usarlo en app.js
module.exports = router;
