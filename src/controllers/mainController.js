// Importamos solo `validationResult` porque el controlador solo necesita LEER los resultados de la validación.
const { validationResult } = require('express-validator');
const productService = require('../services/productService');
// Creamos un objeto que contendrá toda la lógica de nuestras rutas.
const mainController = {
    // Cada método corresponde a una acción o vista.
    getHome: (req, res) => {
        res.render("pages/index", { isAuthPage: false });
    },
    getCheckout: (req, res) => {
        res.render("pages/checkout", { isAuthPage: false });
    },
    getLogin: (req, res) => {
        res.render("pages/login", { isAuthPage: true });
    },
    getProduct: (req, res) => {
        res.render("pages/product", { isAuthPage: false });
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
    }
};

// Exportamos todo el objeto para que el router pueda usar estos métodos.
module.exports = mainController;