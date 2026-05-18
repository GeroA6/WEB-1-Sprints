// importamos la conexión a la base de datos para hacer consultas
const db = require('../db/dataBase');

const productModel = {
    // Busca todos y, si le llega la orden, los ordena directamente con SQL
    findAll: function(sortQuery) {
        let query = `
            SELECT p.*, c.name as category 
            FROM products p 
            LEFT JOIN categories c ON p.category_id = c.id
        `;
        
        // SQLite ordena directamente con ORDER BY
        if (sortQuery === 'asc') {
            query += ` ORDER BY p.price ASC`;
        } else if (sortQuery === 'desc') {
            query += ` ORDER BY p.price DESC`;
        }

        return db.prepare(query).all();
    },

    // Busca uno solo por ID
    findById: function(id) {
        const query = `
            SELECT p.*, c.name as category 
            FROM products p 
            LEFT JOIN categories c ON p.category_id = c.id 
            WHERE p.id = ?
        `;
        return db.prepare(query).get(id); // usamos .get() porque es un solo objeto
    },

    // Filtra por categoría directo en la base de datos
    findByCategory: function(categoryName) {
        const query = `
            SELECT p.*, c.name as category 
            FROM products p 
            LEFT JOIN categories c ON p.category_id = c.id 
            WHERE LOWER(c.name) = LOWER(?)
        `;
        return db.prepare(query).all(categoryName);
    },
  
    // Busca por nombre usando el comodín LIKE de SQL
    searchByName: function(keyword) {
        const query = `
            SELECT p.*, c.name as category 
            FROM products p 
            LEFT JOIN categories c ON p.category_id = c.id 
            WHERE LOWER(p.name) LIKE ?
        `;
        // El comodín '%' significa "cualquier texto antes o después"
        return db.prepare(query).all(`%${keyword.toLowerCase()}%`);
    }

};

module.exports = productModel;