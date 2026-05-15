const db = require('../db/database');

const productModel = {
    // Devuelve todos los productos
    findAll: function() {
        // Usamos .all() para traer todas las filas de la tabla products
        const query = db.prepare('SELECT * FROM products');
        return query.all();
    },

    // Busca uno solo por ID
    findById: function(id) {
        // Usamos .get() con un parámetro (?) para traer un único producto de forma segura
        const query = db.prepare('SELECT * FROM products WHERE id = ?');
        return query.get(id);
    }
    
};

module.exports = productModel;