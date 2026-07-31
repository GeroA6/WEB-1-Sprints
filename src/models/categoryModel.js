// Importamos la conexion a SQLite
const db = require('../db/database');

const categoryModel = {

    // Obtener todas las categorias
    findAll: function () {
        const query = `SELECT * FROM categories`;
        return db.prepare(query).all();
    },

    // Obtener una categoria por ID
    findById: function (id) {
        const query = `SELECT * FROM categories WHERE id = ?`;
        return db.prepare(query).get(id); // el .get() es para que devuelva un solo registro
    },

    // Buscar categoria por nombre
    findByName: function (name) {
        const query = `SELECT * FROM categories WHERE LOWER(name) = LOWER(?)`;
        return db.prepare(query).get(name);
    },

    // Crear una nueva categoria
    create: function (name) {
        const query = `INSERT INTO categories (name) VALUES (LOWER(?))`;
        // .run() devuelve la informacion de la operacion, incluyendo lastInsertRowid
        return db.prepare(query).run(name);
    },

    // Actualizar una categoria
    update: function (id, name) {
        const query = `UPDATE categories SET name = LOWER(?) WHERE id = ?`;
        return db.prepare(query).run(name, id);
    },

    // ELiminar una categoria
    delete: function (id) {
        const query = `DELETE FROM categories WHERE id = ?`;
        return db.prepare(query).run(id);
    },

    // Contar la cantidad de categorias en la base de datos
    count: function () {

    const query = `
        SELECT COUNT(*) AS total
        FROM categories
    `;

    return db.prepare(query).get().total;

},
};

module.exports = categoryModel;