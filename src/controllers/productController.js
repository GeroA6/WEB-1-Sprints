const productService = require('../services/productService');
const productModel = require('../models/productModel');

const productController = {

    /**
     * Muestra la página de detalle para un producto específico.
     * @param {import('express').Request} req - El objeto de solicitud de Express.
     * @param {import('express').Response} res - El objeto de respuesta de Express.
     * @param {import('express').NextFunction} next - La función para pasar el control al siguiente middleware.
     */
    // Método original para el E-commerce (SSR con EJS)
    getDetail: (req, res, next) => {
        const productId = req.params.id;

        try {
            const product = productModel.findById(productId);

            if (!product) {
                const error = new Error('¡Ups! Producto no encontrado.');
                error.status = 404;
                return next(error);
            }

            
            // Buscamos productos relacionados de la misma categoría, excluyendo el producto actual
            let relacionados = [];
            if (product.category) {
                const todosDeCategoria = productModel.findByCategory(product.category);
                relacionados = todosDeCategoria.filter(p => p.id !== product.id);
            }

            // Ahora enviamos 'relacionados' dentro del objeto a la vista EJS
            res.render('pages/productDetail', { 
                product: product, 
                isAuthPage: false,
                relacionados: relacionados // <- Aquí pasamos los productos relacionados a la vista
            });
            
        } catch (error) {
            console.error("Error crítico al renderizar la vista o consultar DB:", error);
            next(error); 
        }
    },

    // 2. metodo para el Dashboard en React (CSR con JSON)
    getDetailApi: (req, res) => {
        const productId = req.params.id;

        try {
            const product = productModel.findById(productId);

            if (!product) {
                return res.status(404).json({ mensaje: 'Producto no encontrado' });
            }
            // Devuelve los datos puros en formato JSON
            res.status(200).json(product);
        } catch (error) {
            // Captura errores estrictos de SQLite
            console.error("Error crítico en la API:", error);
            res.status(500).json({ mensaje: "Error interno del servidor" });
        }
    },
    // Método que renderiza la lista de productos
    listProducts: (req, res) => {
        // Atrapamos la variable 'sort' de la query string (la parte después del ? en la URL, por ejemplo: /products?sort=asc)
        const sortQuery = req.query.sort; 

        // Le pedimos al servicio los productos, pasándole el criterio de orden
        const products = productService.getAllProducts(sortQuery);

        // Renderizamos la vista pasándole los productos ya ordenados
        res.json(products);
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
    },

    // Método para crear el producto (capturado del POST)
    createProduct: (req, res) => {
        const nuevoProducto = req.body;

        try {
            // Llamamos al modelo para que ejecute el SQL
            const resultado = productModel.create(nuevoProducto);

            // Respondemos a React con código 200 (OK)
            res.status(200).json({ 
                mensaje: "Producto guardado correctamente en SQLite",
                id_generado: resultado.lastInsertRowid // SQLite devuelve el ID creado
            });
        } catch (error) {
            console.error("Error al insertar en la base de datos:", error);
            // Si el SQL falla (por ejemplo, falta un dato NOT NULL), devolvemos error 500
            res.status(500).json({ mensaje: "Error interno al guardar el producto" });
        }
    }
};

module.exports = productController;