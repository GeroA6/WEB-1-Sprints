// Importamos solo `validationResult` porque el controlador solo necesita LEER los resultados de la validación.
const { validationResult } = require('express-validator');
const productService = require('../services/productService');

const fs = require('fs'); // Para leer archivos JSON
const path = require('path'); // para construir rutas de archivos de forma

// Funcion auxiliar para obtener los productos desde JSON. Se puede usar en cualquier metodo del controlador.
const getAllProducts = () => {
    const productsPath = path.join(__dirname, '../data/products.json');
    const productsData = fs.readFileSync(productsPath, 'utf-8');
    return JSON.parse(productsData);
}

// Creamos un objeto que contendrá toda la lógica de nuestras rutas.
const mainController = {
    // Cada método corresponde a una acción o vista.
    getHome: (req, res) => {
        // obtener productos con la funcion aux
        const productsData = getAllProducts();

        // Para mostrar productos sugeridos, mezclamos el array de productos y tomamos los primeros 5.
        const sugeridos = productsData
            .sort(()=> 0.5 - Math.random())
            .slice(0, 5); // Esto es solo para mostrar algo aleatorio

        const masPedidos = productsData
            .filter(product => product.masPedidos === true) // filtramos por el flag "masPedidos" 
            .sort(() => 0.5 - Math.random()) // lo mezclamos
            .slice(0, 10); // Limite de 10 productos

        res.render("pages/index", { isAuthPage: false, sugeridos: sugeridos, masPedidos:masPedidos }); //array a la vista
    },
    getCheckout: (req, res) => {
        res.render("pages/checkout", { isAuthPage: false });
    },
    getLogin: (req, res) => {
        res.render("pages/login", { isAuthPage: true });
    },
    getProduct: (req, res) => {
        // llamamos la funcion aux para obtener los productos
        const productsData = getAllProducts();

        const productId = parseInt(req.params.id); // obtenemos el id de la URL
        const productPrincipal = productsData.find(p => p.id === productId);
            if (!productPrincipal){
                return res.status(404).render("pages/404");
            }

            let relacionados = productsData.filter(p => p.category &&
                p.id !== productId
            );

            if (relacionados.length > 0){
                relacionados = relacionados
                    .sort(() => 0.5 - Math.random())
                    .slice(0, 4);
            }

        res.render("pages/product", { isAuthPage: false, product: productPrincipal, relacionados: relacionados });
    },
    getProfile: (req, res) => {
        res.render("pages/profile", { isAuthPage: true });
    },
    getRegister: (req, res) => {
        // Al mostrar el formulario por primera vez, pasamos variables vacías
        // para que la vista no se rompa al intentar leer `errors` u `oldData`.
        res.render("pages/register", { isAuthPage: true, errors: [], oldData: {} });
    },
   getSearch: (req, res) => {
        // Atrapamos la palabra que viene en la URL (?query=...)
        const searchQuery = req.query.query; 
        let results = [];

        // Si el usuario escribió algo, llamamos al servicio para filtrar
        if (searchQuery) {
            results = productService.searchProducts(searchQuery);
        }

        // Pasamos los resultados filtrados y la palabra buscada a la vista
        res.render("pages/search", { 
            isAuthPage: false,
            products: results, 
            searchQuery: searchQuery
        });
    },

    // Este método procesa los datos del formulario de registro.
    processRegister: (req, res) => {
        // 1. `validationResult(req)` recolecta cualquier error que las validaciones (en el router) hayan encontrado.
        const errors = validationResult(req);

        // 2. Si el objeto `errors` no está vacío, significa que hubo fallos.
        if (!errors.isEmpty()) {
            // Volvemos a renderizar la vista de registro, pero esta vez pasándole los errores
            // y los datos que el usuario ya había ingresado (`req.body`).
            return res.status(400).render('pages/register', {
                isAuthPage: true,
                errors: errors.array(),
                oldData: req.body
            });
        }

        // 3. Si no hay errores, la validación fue exitosa.
        console.log("¡Validación exitosa! Datos a guardar: ", req.body);
        res.redirect("/login");
    },

    getCategory: (req, res) => {
        const productsData = getAllProducts();
        const requestedCategory = req.params.category; // obtenemos la categoría de la URL
        const productosFiltrados = productsData.filter(
            p => p.category.toLowerCase() === requestedCategory.toLowerCase()); // filtramos los productos por categoría (ignorando mayúsculas/minúsculas)
    
            res.render("pages/category", {
                isAuthPage: false, // no es una página de autenticación
                categoriaNombre: requestedCategory, // pasa el nombre de la categoria para mostrarlo en la vista
                productos: productosFiltrados
            });
        },


};

// Exportamos todo el objeto para que el router pueda usar estos métodos.
module.exports = mainController;