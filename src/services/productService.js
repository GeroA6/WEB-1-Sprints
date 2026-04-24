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

    // funcion para obtener todos los productos
    getAllProducts: function() {
        return this._readJson();
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