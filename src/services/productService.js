const fs = require('fs');
const path = require('path');

// Definimos la ruta exacta al archivo JSON usando path.join y __dirname
// __dirname nos da la ruta de la carpeta actual (services), y de ahí subimos un nivel y entramos a data
const productsFilePath = path.join(__dirname, '../data/products.json');

const productsService = {
    
    // Función para leer y convertir el JSON a un Array de JS, con esto evitamos repetir código cada vez que necesitemos acceder a los productos
    _readJson: function() {
        // Leemos el archivo JSON
        const productsJSON = fs.readFileSync(productsFilePath, 'utf-8');
        // Lo convertimos en un objeto/array de JS
        return JSON.parse(productsJSON);
    },

    // MÉTODOS PARA LOS CONTROLLERS

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
        const product = this.getProductById(parsedId);
        if (!product) {
            const error = new Error('¡Ups! Producto no encontrado.');
            error.status = 404;
            throw error;
        }

        return parsedId;
    },

    // funcion para obtener todos los productos
    getAllProducts: function(sortQuery) {

        const products = this._readJson();
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
        // Leemos el JSON y luego usamos .find() para obtener el producto que coincida con el ID
        const products = this._readJson();
        return products.find(product => product.id == id);
    },

    // funcion para obtener productos por categoria
    getProductsByCategory: function(categoryName) {
        const products = this._readJson();
        // Usamos .filter() que devuelve un array con todos los que coincidan con la categoría dada
        return products.filter(product => product.category === categoryName);
    },

    // buscador de productos por nombre, devuelve un array con los productos que contengan el texto buscado
    searchProducts: function(query) {
        const products = this._readJson();
        //convertimos la consulta a minusculas para que coincida
        const lowerQuery = query.toLowerCase();
        return products.filter(product => 
            product.name.toLowerCase().includes(lowerQuery)
        );
    }

    

};

// exportamos el servicio para que el resto del proyecto pueda usarlo
module.exports = productsService;