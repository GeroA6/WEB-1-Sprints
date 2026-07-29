const productsService = require('../../services/productService');

const productsApiController = {
    // GET ALL Devuelve el listado completo
    getAll: (req, res) => {
        try {
            const products = productsService.getAllProducts(); // Ajusta el nombre si el servicio usa otro
            res.status(200).json(products);
        } catch (error) {
            console.error("Error al obtener productos:", error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    },


    // GETById -> Devuelve el detalle de un producto específico
    getById: (req, res) => {
        try {
            const product = productsService.getProductById(req.params.id);
            
            if (!product) {
                // Si no existe, devuelve 404
                return res.status(404).json({ error: 'Producto no encontrado' });
            }
            
            res.status(200).json(product);
        } catch (error) {
            console.error("Error al obtener el producto:", error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    },

    // POST -> Registra un nuevo producto recibiendo JSON en el body
    create: (req, res) => {
        try {
            // Express ya parseó req.body gracias a app.use(express.json())
            const newProduct = productsService.createProduct(req.body);
            
            // Retorna 201 Created tras una inserción exitosa
            res.status(201).json(newProduct);
        } catch (error) {
            console.error("Error al crear el producto:", error);
            res.status(500).json({ error: 'Error interno al guardar el producto' });
        }
    },



    // PUT -> Actualiza los datos de un producto existente
    update: (req, res) => {
        try {
            // 1. Verificamos que el producto exista antes de actualizar
            const product = productsService.getProductById(req.params.id);
            
            if (!product) {
                return res.status(404).json({ error: 'Producto no encontrado' });
            }

            // 2. Ejecutamos la actualización en el servicio
            const updatedProduct = productsService.updateProduct(req.params.id, req.body);
            res.status(200).json(updatedProduct);
        } catch (error) {
            console.error("Error al actualizar el producto:", error);
            res.status(500).json({ error: 'Error interno al actualizar' });
        }
    },



    // DELETE -> Elimina un producto por su ID
    delete: (req, res) => {
        try {
            const product = productsService.getProductById(req.params.id);
            
            if (!product) {
                return res.status(404).json({ error: 'Producto no encontrado' });
            }

            productsService.deleteProduct(req.params.id);
            // Retorna 200 OK con mensaje (o 204 sin contenido)
            res.status(200).json({ mensaje: 'Producto eliminado con éxito' });
        } catch (error) {
            console.error("Error al eliminar el producto:", error);
            res.status(500).json({ error: 'Error interno al eliminar' });
        }
    }
};

module.exports = productsApiController;