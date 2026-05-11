// Importamos el modelo
const productModel = require('../models/productModel');

const productsService = {

    // Función para normalizar y validar IDs de productos
    normalizeId: function(id) {
        const parsedId = parseInt(id, 10);
        
        // 1. Escenario: ID no numérico -> 400
        if (isNaN(parsedId)) {
            const error = new Error('Formato de ID inválido. Debe ser un número.');
            error.status = 400;
            throw error;
        }

        // 2. Escenario: ID numérico pero inexistente -> 404
        //ahora le pediremos al modelo que lo busque
        const product = productModel.findById(parsedId);
        if (!product) {
            const error = new Error('¡Ups! Producto no encontrado.');
            error.status = 404;
            throw error;
        }

        return parsedId;
    },
    // funcion para obtener productos por categoria
    getProductsByCategory: function(categoryName) {
        const products = productModel.findAll();
        // Filtramos comparando en minúsculas para evitar errores si escriben "Bebidas" o "bebidas"
        return products.filter(product => 
            product.category.toLowerCase() === categoryName.toLowerCase()
        );
    },
    // funcion para obtener todos los productos
    getAllProducts: function(sortQuery) {
        //ahora le pediremos todos al modelo
        const products = productModel.findAll();
        // Hacemos una copia del array para no modificar el JSON original en memoria
        let sortedProducts = [...products];

        // Lógica de ordenamiento: si sortQuery es 'asc', ordenamos de menor a mayor; si es 'desc', de mayor a menor
        // que sea 'asc' significa que ese string se encuentra en la query de la URL, por ejemplo: /products?sort=asc, lo mismo para 'desc'
        if (sortQuery === 'asc') {
            sortedProducts.sort((a, b) => a.price - b.price);
        } else if (sortQuery === 'desc') {
            sortedProducts.sort((a, b) => b.price - a.price);
        }
        
        // Si sortQuery no es ni 'asc' ni 'desc' (o es undefined), devuelve el array normal
        return sortedProducts;
    },

    // funcion para obtener un producto por su ID
    getProductById: function(id) {
        
        return productModel.findById(id);
    },

    // buscador de productos por nombre, devuelve un array con los productos que contengan el texto buscado
    searchProducts: function(query) {
        const products = productModel.findAll();
        const lowerQuery = query.toLowerCase();
        return products.filter(product => 
            product.name.toLowerCase().includes(lowerQuery)
        );
    }

    

};

// exportamos el servicio para que el resto del proyecto pueda usarlo
module.exports = productsService;