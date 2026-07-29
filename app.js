// ========================================================================
// 1. IMPORTACIÓN DE HERRAMIENTAS (DEPENDENCIAS)
// ========================================================================

// Importamos el framework Express, que nos facilita la creación y manejo del servidor web.
const express = require('express');

// Importamos el módulo 'cors' para permitir solicitudes de diferentes dominios esto nos servirá para el front 
const cors = require('cors');
// Importamos el módulo 'path' (nativo de Node.js) para manejar las rutas de las carpetas 
// de forma segura, sin importar si usamos Windows, Mac o Linux.
const path = require('path');

// importamos el framework de manejo de sesiones
const session = require('express-session');

// Importamos dotenv para cargar las variables de entorno desde el archivo .env
require('dotenv').config();

// importamos la configuracion de la BD para que se conecte al arrancar el servidor
require('./src/db/database.js');
// ========================================================================
// 2. INICIALIZACIÓN Y CONFIGURACIÓN BÁSICA
// ========================================================================

// Ejecutamos Express y guardamos toda su funcionalidad en la variable 'app'. 
// A partir de ahora, 'app' es nuestro servidor.
const app = express();

// Definimos en qué "canal" (puerto) de nuestra red local va a escuchar el servidor.
// El 3000 es el estándar más usado para desarrollo.
const port = 3000;

// Habilitamos CORS para permitir solicitudes desde otros dominios
app.use(cors());

// ========================================================================
// 3. CONFIGURACIÓN DEL MOTOR DE VISTAS (RENDERIZADO)
// ========================================================================

// Le indicamos a Express la ubicación exacta de la carpeta donde guardamos nuestras pantallas.
// '__dirname' obtiene la ruta actual del proyecto automáticamente.
app.set("views", path.join(__dirname, "src", "views"));

// Le decimos a Express que el "traductor" que usaremos para convertir nuestro código a HTML es EJS.
app.set("view engine", "ejs");

// ========================================================================
// 4. CONFIGURACIÓN DE ARCHIVOS ESTÁTICOS
// ========================================================================

// Definimos la carpeta 'public' como de acceso público. Esto permite que el navegador 
// pueda pedir el archivo styles.css o las imágenes de forma directa, sin que tengamos 
// que programar una ruta especial para cada archivo.
app.use(express.static(path.join(__dirname, "public")));

// Middleware global para poder leer los datos que viajan en el `body` de un formulario.
// Es crucial para que `req.body` funcione en tus controladores.
app.use(express.urlencoded({ extended: false }));
// Permite a Express entender los JSON que llegan desde el Front End (React)
app.use(express.json());

// ========================================================================
// CONFIGURACIÓN DE SESIONES
// ========================================================================

app.use(session({
    secret: process.env.secret, //frase secreta para firmar la cookie
    resave: false, //no guardar la sesión si no ha cambiado
    saveUninitialized: false, //no guardar una sesión vacía
    cookie: { secure: false } //en desarrollo, no usamos HTTPS, así que secure es false. En producción, debería ser true.

}));

const userSessionMiddleware = require('./src/middlewares/userSessionMiddleware');
app.use(userSessionMiddleware);

// ========================================================================
// 5. ENRUTAMIENTO
// ========================================================================

// Importamos las rutas de la API
const mainApiRoutes = require('./src/routes/api/mainApiRoutes');
const productsApiRoutes = require('./src/routes/api/productsApiRoutes');

// Definimos las rutas de la API bajo el prefijo '/api'
app.use('/api', mainApiRoutes);

// Importamos las rutas de la API
app.use('/api/products', productsApiRoutes);

// Importamos los archivos de rutas que creamos.
const mainRoutes = require('./src/routes/mainRoutes');
const productRoutes = require('./src/routes/productRoutes');

// Le decimos a la app que para cualquier petición que empiece con '/products',
// debe usar las rutas definidas en `productRoutes`.
app.use('/products', productRoutes);
// Le decimos a nuestra aplicación que para cualquier petición que empiece con '/',
// debe usar las rutas definidas en `mainRoutes`.
app.use('/', mainRoutes);

// Importamos las rutas del carrito y las usamos para cualquier URL que empiece con '/cart'
const cartRoutes = require('./src/routes/cartRoutes');
app.use('/cart', cartRoutes);

// Captura todas las rutas no definidas
app.use((req, res, next) => {
    //se crear el objeto error con la etiqueta 404
    const error = new Error('No encontrado');
    error.status = 404;
    next(error);
});

// Manejador de errores
app.use((err, req, res, next) => {
    const status = err.status || 500;

    // 1. Registramos el error completo en la terminal (solo tú lo ves)
    console.error(`[Error ${status}]:`, err.message, err.stack);

    // 2. Filtramos el mensaje para la vista: si es 500, ocultamos el error real
    const message = status >= 500 ? 'Error interno del servidor' : err.message;
    res.status(status).render('pages/error', { isAuthPage: false, status: status, message: message });
})
// 7. Arrancamos el servidor
app.listen(port, () => {
    // Esta función se ejecuta una sola vez, justo cuando el servidor arranca con éxito,
    // para avisarnos por la terminal que todo salió bien.
    console.log(`Servidor corriendo en el puerto: ${port}`);
});
