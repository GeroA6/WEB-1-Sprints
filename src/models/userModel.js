const db = require('../db/database');

const userModel = {
    // Obtener todos los usuarios (excluimos la contraseña por seguridad)
    findAll: function () {
        const query = `SELECT id, name, email, role, created_at FROM users`;
        return db.prepare(query).all();
    },

    // Buscar usuario por ID (excluimos la contraseña)
    findById: function (id) {
        const query = `SELECT id, name, email, role, created_at FROM users WHERE id = ?`;
        return db.prepare(query).get(id);
    },

    // Buscar usuario por Email (INCLUYE password_hash para poder autenticar en el login)
    findByEmail: function (email) {
        const query = `SELECT * FROM users WHERE LOWER(email) = LOWER(?)`;
        return db.prepare(query).get(email);
    },

    // Crear un nuevo usuario (recibe objeto con name, email, password_hash y opcionalmente role)
    create: function (userData) {
        const role = userData.role || 'customer';
        const query = `
            INSERT INTO users (name, email, password_hash, role)
            VALUES (?, LOWER(?), ?, ?)
        `;
        return db.prepare(query).run(
            userData.name,
            userData.email,
            userData.password_hash,
            role
        );
    },

    // Actualizar los datos de un usuario
    update: function (id, userData) {
        if (userData.role) {
            const query = `
                UPDATE users
                SET name = ?, email = LOWER(?), role = ?
                WHERE id = ?
            `;
            return db.prepare(query).run(
                userData.name,
                userData.email,
                userData.role,
                id
            );
        }
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
