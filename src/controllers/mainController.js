// Importamos solo `validationResult` porque el controlador solo necesita LEER los resultados de la validación.
const { validationResult } = require('express-validator');
const productService = require('../services/productService'); //aqui exportamos al servicio del producto
const userService = require('../services/userService'); // aqui importamos al servicio de usuarios

// Creamos un objeto que contendrá toda la lógica de nuestras rutas.
const mainController = {
    // Cada método corresponde a una acción o vista.
    getHome: (req, res) => {
        // Atrapamos el pedido de orden desde la URL (ej: /?sort=asc)
        const sortQuery = req.query.sort;

        // Le pasamos el sortQuery al servicio.
        const productsData = productService.getAllProducts(sortQuery);

        // Para mostrar productos sugeridos, mezclamos el array de productos y tomamos los primeros 5.
        const sugeridos = [...productsData]
            .sort(() => 0.5 - Math.random())
            .slice(0, 5); // Esto es solo para mostrar algo aleatorio

        const masPedidos = productsData
            .filter(product => product.masPedidos === 1) // filtramos por el flag "masPedidos" 
            .sort(() => 0.5 - Math.random()) // lo mezclamos
            .slice(0, 10); // Limite de 10 productos

        res.render("pages/index", { isAuthPage: false, sugeridos: sugeridos, masPedidos: masPedidos, products: productsData, sortQuery: sortQuery }); //array a la vista
    },
    getCheckout: (req, res) => {
        const cartService = require('../services/cartService');
        const { cartWithDetails, total } = cartService.getCartDetails(req.session);
        res.render("pages/checkout", { 
            isAuthPage: false, 
            cart: cartWithDetails, 
            total: total,
            paidSuccess: false 
        });
    },
    postCheckoutPay: (req, res) => {
        const cartService = require('../services/cartService');
        cartService.clearCart(req.session);
        res.render("pages/checkout", { 
            isAuthPage: false, 
            cart: [], 
            total: 0,
            paidSuccess: true 
        });
    },
    getLogin: (req, res) => {
        res.render("pages/login", { isAuthPage: true, errors: [], oldData: {} });
    },
    getProduct: (req, res, next) => {
        // llamamos la funcion aux para obtener los productos desde el JSON
        try {
            const productsData = productService.getAllProducts();

            // Usamos la normalización centralizada para validar
            const productId = productService.normalizeId(req.params.id);

            const productPrincipal = productsData.find(p => p.id === productId);

            let relacionados = productsData.filter(p => p.category === productPrincipal.category &&
                p.id !== productId
            );

            if (relacionados.length > 0) {
                relacionados = relacionados
                    .sort(() => 0.5 - Math.random())
                    .slice(0, 4);
            }

            res.render("pages/productDetail", { isAuthPage: false, product: productPrincipal, relacionados: relacionados });
        } catch (error) {
            next(error);
        }
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

    // Procesar Registro de Usuario
    processRegister: (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).render('pages/register', {
                isAuthPage: true,
                errors: errors.array(),
                oldData: req.body
            });
        }

        try {
            // Creamos el nombre completo uniendo nombre y apellido
            const fullName = `${req.body.nombre} ${req.body.apellido}`.trim();

            // Guardamos en SQLite usando userService (encripta con bcrypt)
            const newUser = userService.registerUser({
                name: fullName,
                email: req.body.email,
                password: req.body.password
            });

            // Opcional: auto-login guardándolo en la sesión
            req.session.user = newUser;

            // Redireccionar al inicio
            return res.redirect("/");
        } catch (error) {
            console.error("Error al registrar usuario:", error);
            return res.status(400).render('pages/register', {
                isAuthPage: true,
                errors: [{ msg: error.message }],
                oldData: req.body
            });
        }
    },

    // Procesar Inicio de Sesión (Login)
    processLogin: (req, res) => {
        try {
            const { email, password } = req.body;

            // Autenticamos usando userService (compara bcrypt)
            const user = userService.loginUser(email, password);

            // Guardamos en la sesión de Express
            req.session.user = user;

            return res.redirect("/");
        } catch (error) {
            console.error("Error al iniciar sesión:", error);
            return res.status(401).render('pages/login', {
                isAuthPage: true,
                errors: [{ msg: error.message }],
                oldData: req.body
            });
        }
    },

    // Cierre de Sesión (Logout)
    logout: (req, res) => {
        req.session.destroy(() => {
            res.redirect("/");
        });
    },

    getCategory: (req, res) => {
        const requestedCategory = req.params.category; // obtenemos la categoría de la URL
        const productosFiltrados = productService.getProductsByCategory(requestedCategory);// filtramos los productos por categoría (ignorando mayúsculas/minúsculas)

        res.render("pages/category", {
            isAuthPage: false, // no es una página de autenticación
            categoriaNombre: requestedCategory, // pasa el nombre de la categoria para mostrarlo en la vista
            productos: productosFiltrados
        });
    },


};

// Exportamos todo el objeto para que el router pueda usar estos métodos.
module.exports = mainController;