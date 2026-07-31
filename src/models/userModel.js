const db = require('../db/database');

const userModel = {
    // Obtener todos los usuarios (excluimos la contraseña por seguridad)
    findAll: function () {
        const query = `SELECT id, name, email, created_at FROM users`;
        return db.prepare(query).all();
    },

    // Buscar usuario por ID (excluimos la contraseña)
    findById: function (id) {
        const query = `SELECT id, name, email, created_at FROM users WHERE id = ?`;
        return db.prepare(query).get(id);
    },

    // Buscar usuario por Email (INCLUYE password_hash para poder autenticar en el login)
    findByEmail: function (email) {
        const query = `SELECT * FROM users WHERE LOWER(email) = LOWER(?)`;
        return db.prepare(query).get(email);
    },

    // Crear un nuevo usuario (recibe objeto con name, email y password_hash)
    create: function (userData) {
        const query = `
            INSERT INTO users (name, email, password_hash)
            VALUES (?, LOWER(?), ?)
        `;
        return db.prepare(query).run(
            userData.name,
            userData.email,
            userData.password_hash
        );
    },

    // Actualizar los datos de un usuario
    update: function (id, userData) {
        const query = `
            UPDATE users
            SET name = ?, email = LOWER(?)
            WHERE id = ?
        `;
        return db.prepare(query).run(
            userData.name,
            userData.email,
            id
        );
    },

    // Eliminar un usuario por ID
    delete: function (id) {
        const query = `DELETE FROM users WHERE id = ?`;
        return db.prepare(query).run(id);
    },

    // Contar total de usuarios en la BD
    count: function () {
        const query = `SELECT COUNT(*) as total FROM users`;
        return db.prepare(query).get();
    }
};

module.exports = userModel;
