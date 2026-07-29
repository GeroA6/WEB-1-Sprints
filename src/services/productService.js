// importamos el modelo para acceder a la base de datos
const productModel = require('../models/productModel');

const productsService = {


    normalizeId: function (id) {
        const parsedId = parseInt(id, 10);


        if (isNaN(parsedId)) {
            const error = new Error('Formato de ID inválido. Debe ser un número.');
            error.status = 400;
            throw error;
        }

        // Ahora esto le pregunta a SQLite si el producto existe.
        const product = productModel.findById(parsedId);
        if (!product) {
            const error = new Error('¡Ups! Producto no encontrado.');
            error.status = 404;
            throw error;
        }

        return parsedId;
    },

    getProductsByCategory: function (categoryName) {
        // En vez de un .filter(), le pedimos al modelo que traiga solo esa categoría
        return productModel.findByCategory(categoryName);
    },

    getAllProducts: function (sortQuery) {
        // El modelo ahora se encarga de todo, incluso del ORDER BY
        return productModel.findAll(sortQuery);
    },

    getProductById: function (id) {
        return productModel.findById(id);
    },

    searchProducts: function (query) {
        // Usamos el buscador SQL con LIKE que armó el modelo
        return productModel.searchByName(query);
    },

    createProduct: function (productoData) {
        // Guardamos en SQLite y obtenemos el resultado de la inserción
        const result = productModel.create(productoData);
        //Usamos el ID que nos devolvió la inserción
        return productModel.findById(result.lastInsertRowid);
    },

    updateProduct: function (id, productData) {
        // Valida que exista y devuelve el ID parseado
        const validId = this.normalizeId(id);
        // Actualiza en la BD
        productModel.update(validId, productData);
        // Retorna el producto con los nuevos datos 
        return productModel.findById(validId);
    },

    deleteProduct: function (id) {
        const validId = this.normalizeId(id);
        return productModel.delete(validId);
    }

};

module.exports = productsService;