// 1. Importamos Express para crear el servidor y Path para gestionar rutas de archivos
const express = require('express');
const path = require('path');

// 2. Creamos la instancia de la aplicación Express
const app = express();

// 3. Definimos el puerto donde escuchará el servidor (común en desarrollo local)
const port = 3000;

// 4. Configuramos el motor de plantillas
// 'views' le dice a Express dónde están los archivos .ejs (usamos ruta absoluta con path.join)
app.set("views", path.join(__dirname, "views"));
// 'view engine' establece EJS como nuestra herramienta para generar el HTML dinámico
app.set("view engine", "ejs");

// 5. Configuramos la carpeta de archivos estáticos (CSS, imágenes, JS del cliente)
// Al usar path.join(__dirname, "public"), el servidor siempre encontrará tus estilos
app.use(express.static(path.join(__dirname, "public")));

// 6. Definimos la ruta raíz (cuando alguien entra a http://localhost:3000/)
app.get('/', (req, res) => {
    // res.render busca en la carpeta 'views' el archivo 'pages/index.ejs' y lo envía al navegador
    res.render("pages/index", {isAuthPage: false});
});

app.get('/cart', (req, res) => {
    res.render("pages/cart", {isAuthPage: true});
});

app.get('/checkout', (req, res) => {
    res.render("pages/checkout", {isAuthPage: false});
});

app.get('/login', (req, res) => {
    res.render("pages/login", {isAuthPage: true});
})

app.get('/product', (req, res) => {
    res.render("pages/product", {isAuthPage: false});
});

app.get('/profile', (req, res) => {
    res.render("pages/profile", {isAuthPage: true});
});

app.get('/register', (req, res) => {
    res.render("pages/register", {isAuthPage: true});
});

// Captura todas las rutas no definidas
app.use((req, res, next) => {
    res.status(404).render('pages/404');
});

// 7. Arrancamos el servidor
app.listen(port, () => {
    // Nota: Usamos comillas invertidas (backticks) `` para que ${port} imprima el número 3000
    console.log(`Servidor corriendo en el puerto: ${port}`);
});