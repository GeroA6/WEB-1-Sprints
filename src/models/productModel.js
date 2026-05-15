const fs = require('fs');
const path = require('path');

const productsFilePath = path.join(__dirname, '../data/products.json');

const productModel = {
    // El método privado para leer el archivo
    _readJson: function() {
        const productsJSON = fs.readFileSync(productsFilePath, 'utf-8');
        return JSON.parse(productsJSON);
    },

    // Devuelve todos los productos
    findAll: function() {
        return this._readJson();
    },

    // Busca uno solo por ID
    findById: function(id) {
        const products = this.findAll();
        // Usamos == para que compare string con number sin problemas
        return products.find(product => product.id == id);
    }
    
};

module.exports = productModel;