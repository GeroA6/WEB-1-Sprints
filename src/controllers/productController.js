const productService = require('../services/productService');

const productController = {

    /**
     * Muestra la página de detalle para un producto específico.
     * @param {import('express').Request} req - El objeto de solicitud de Express.
     * @param {import('express').Response} res - El objeto de respuesta de Express.
     * @param {import('express').NextFunction} next - La función para pasar el control al siguiente middleware.
     */
    getDetail: (req, res, next) => {
        // 1. Obtenemos el ID del producto desde los parámetros de la URL.
        const productId = req.params.id;

        // 2. Usamos el servicio para buscar el producto por su ID.
        const product = productService.getProductById(productId);

        // 3. Escenario 2: Si el producto no se encuentra...
        if (!product) {
            // Creamos un error con estado 404 y se lo pasamos al manejador de errores de app.js
            const error = new Error('¡Ups! Producto no encontrado.');
            error.status = 404;
            return next(error);
        try {
            // 1. Normalizamos y validamos el ID (Lanza 400 o 404 automáticamente si hay fallo)
            const productId = productService.normalizeId(req.params.id);
    
            // 2. Obtenemos el producto (ya sabemos que existe gracias a la validación)
            const product = productService.getProductById(productId);
    
            // 3. Renderizamos la vista de detalle
            res.render('pages/productDetail', { product: product, isAuthPage: false });
        } catch (error) {
            next(error);
        }
    }
   },

    // Método que renderiza la lista de productos
    listProducts: (req, res) => {
        // Atrapamos la variable 'sort' de la query string (la parte después del ? en la URL, por ejemplo: /products?sort=asc)
        const sortQuery = req.query.sort; 

        // Le pedimos al servicio los productos, pasándole el criterio de orden
        const products = productService.getAllProducts(sortQuery);

        // Renderizamos la vista pasándole los productos ya ordenados
        res.render('pages/product', { products: products });
    },

    // Método para manejar la búsqueda de productos
    search: (req, res) => {
        // Atrapamos la palabra desde la URL (?query=...)
        const searchQuery = req.query.query; 
        // Si no hay una consulta de búsqueda, simplemente renderizamos la vista sin resultados.
        let results = [];

        if (searchQuery) {
            results = productService.searchProducts(searchQuery);
        }

        // Reutilizamos la vista de productos pasándole los resultados filtrados.
        // Si no hay resultados (results.length === 0), la vista EJS debería mostrar el mensaje amigable.
        res.render('pages/product', { 
            products: results,
            searchQuery: searchQuery 
        });
    }
};

module.exports = productController;