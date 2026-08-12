// =========================================
// Importacion de dependencias de express
// =========================================

const express = require('express');
const cors = require('cors');
const path = require('path');
const session = require('express-session');
require('dotenv').config();
require('./src/db/database');

const app = express();
const PORT = process.env.PORT || 3000;

// ==========================================
// 1. MIDDLEWARES GLOBALES & SEGURIDAD
// ==========================================
app.use(cors({
    origin: ['http://localhost:5173', 'https://negratone.onrender.com']
})); // Habilita peticiones Cross-Origin (Dashboard React)
app.use(express.json()); // Parsea payloads JSON
app.use(express.urlencoded({ extended: false })); // Parsea formularios HTML de EJS
app.use(express.static(path.join(__dirname, 'public'))); // Servir archivos estáticos

// ==========================================
// 2. MOTOR DE PLANTILLAS (EJS - SSR)
// ==========================================
app.set('views', path.join(__dirname, 'src', 'views'));
app.set('view engine', 'ejs');

// ==========================================
// 3. GESTIÓN DE SESIONES & USUARIO
// ==========================================
app.use(session({
    secret: process.env.secret,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // false en localhost HTTP
}));

const userSessionMiddleware = require('./src/middlewares/userSessionMiddleware');
app.use(userSessionMiddleware);

// ==========================================
// 4. ENRUTAMIENTO (API REST & TIENDA WEB)
// ==========================================
// API REST (Dashboard React & Clientes)
app.use('/api', require('./src/routes/api'));

// Vistas EJS (Tienda E-Commerce)
app.use('/', require('./src/routes/mainRoutes'));
app.use('/products', require('./src/routes/productRoutes'));
app.use('/cart', require('./src/routes/cartRoutes'));

// ==========================================
// 5. MANEJO DE ERRORES (404 & GLOBAL)
// ==========================================
// 404 - Ruta no encontrada
app.use((req, res, next) => {
    const error = new Error('Página no encontrada');
    error.status = 404;
    next(error);
});

// Manejador de errores global (4 parámetros: err, req, res, next)
app.use((err, req, res, next) => {
    const status = err.status || 500;
    console.error(`[Error ${status}]:`, err.message);

    // Si la petición proviene de la API REST, respondemos en JSON
    if (req.originalUrl.startsWith('/api')) {
        return res.status(status).json({ error: err.message || 'Error interno del servidor' });
    }

    // Si proviene de la tienda web, renderizamos la vista de error EJS
    const message = status >= 500 ? 'Error interno del servidor' : err.message;
    res.status(status).render('pages/error', { isAuthPage: false, status, message });
});

// ==========================================
// 6. INICIALIZACIÓN DEL SERVIDOR
// ==========================================
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto: ${PORT}`);
});
