// ========================================================================
// 1. IMPORTACIÓN DE HERRAMIENTAS (DEPENDENCIAS)
// ========================================================================

// Importamos el framework Express, que nos facilita la creación y manejo del servidor web.
const express = require('express'); 

// Importamos el módulo 'path' (nativo de Node.js) para manejar las rutas de las carpetas 
// de forma segura, sin importar si usamos Windows, Mac o Linux.
const path = require('path'); 

// ========================================================================
// 2. INICIALIZACIÓN Y CONFIGURACIÓN BÁSICA
// ========================================================================

// Ejecutamos Express y guardamos toda su funcionalidad en la variable 'app'. 
// A partir de ahora, 'app' es nuestro servidor.
const app = express(); 

// Definimos en qué "canal" (puerto) de nuestra red local va a escuchar el servidor.
// El 3000 es el estándar más usado para desarrollo.
const port = 3000; 

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

// ========================================================================
// 5. ENRUTAMIENTO
// ========================================================================

// Importamos el archivo de rutas que creamos.
const mainRoutes = require('./src/routes/mainRoutes');

// Le decimos a nuestra aplicación que para cualquier petición que empiece con '/',
// debe usar las rutas definidas en `mainRoutes`.
app.use('/', mainRoutes);

// Captura todas las rutas no definidas
app.use((req, res, next) =>{
    //se crear el objeto error con la etiqueta 404
    const error = new Error('No encontrado');
    error.status = 404;
    next(error);
});

// Manejador de errores
app.use((err, req, res, next) => {
    const status = err.status || 500;
    const message = err.message || 'Error interno del servidor';
    res.status(status).render('pages/error', {isAuthPage: false, status: status,message: message})
})
// 7. Arrancamos el servidor
app.listen(port, () => {
    // Esta función se ejecuta una sola vez, justo cuando el servidor arranca con éxito,
    // para avisarnos por la terminal que todo salió bien.
    console.log(`Servidor corriendo en el puerto: ${port}`);
});