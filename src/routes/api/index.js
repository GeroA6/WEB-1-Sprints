const express = require('express');
const router = express.Router();

// Importación de submódulos de rutas API
const mainApiRoutes = require('./mainApiRoutes');
const authApiRoutes = require('./authApiRoutes');
const productsApiRoutes = require('./productsApiRoutes');
const categoriesApiRoutes = require('./categoriesApiRoutes');
const statsApiRoutes = require('./statsApiRoutes');
const usersApiRoutes = require('./usersApiRoutes');

// Mapeo de prefijos API REST (/api/...)
router.use('/', mainApiRoutes);
router.use('/auth', authApiRoutes);
router.use('/products', productsApiRoutes);
router.use('/categories', categoriesApiRoutes);
router.use('/stats', statsApiRoutes);
router.use('/users', usersApiRoutes);

module.exports = router;
