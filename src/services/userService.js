const bcrypt = require('bcryptjs');
const userModel = require('../models/userModel');

const userService = {
    // Helper para normalizar y validar IDs numéricos
    normalizeId: function (id) {
        const parsedId = parseInt(id, 10);
        if (isNaN(parsedId)) {
            const error = new Error('Formato de ID inválido. Debe ser un número.');
            error.status = 400;
            throw error;
        }
        return parsedId;
    },

    // Registrar un nuevo usuario con contraseña encriptada
    registerUser: function (data) {
        if (!data || !data.name || !data.email || !data.password) {
            const error = new Error('Todos los campos (nombre, email, contraseña) son obligatorios.');
            error.status = 400;
            throw error;
        }

        const trimmedEmail = data.email.trim().toLowerCase();

        // Verificar si el email ya existe en la base de datos
        const existingUser = userModel.findByEmail(trimmedEmail);
        if (existingUser) {
            const error = new Error('El correo electrónico ya se encuentra registrado.');
            error.status = 400;
            throw error;
        }

        // Encriptar la contraseña con bcrypt (10 rondas de salt)
        const password_hash = bcrypt.hashSync(data.password, 10);

        // Crear el usuario en SQLite
        const result = userModel.create({
            name: data.name.trim(),
            email: trimmedEmail,
            password_hash: password_hash
        });

        // Retornar el usuario recién creado (sin incluir la contraseña)
        return userModel.findById(result.lastInsertRowid);
    },

    // Autenticar un usuario (Login)
    loginUser: function (email, password) {
        if (!email || !password) {
            const error = new Error('Email y contraseña son obligatorios.');
            error.status = 400;
            throw error;
        }

        // Buscar usuario por email en la BD
        const user = userModel.findByEmail(email.trim());
        if (!user) {
            const error = new Error('Credenciales inválidas. Email o contraseña incorrectos.');
            error.status = 401; // 401 Unauthorized
            throw error;
        }

        // Comparar la contraseña ingresada con el hash guardado en la BD
        const isMatch = bcrypt.compareSync(password, user.password_hash);
        if (!isMatch) {
            const error = new Error('Credenciales inválidas. Email o contraseña incorrectos.');
            error.status = 401;
            throw error;
        }

        // Quitar el password_hash antes de retornar los datos de la sesión
        const { password_hash, ...safeUser } = user;
        return safeUser;
    },

    // Obtener todos los usuarios
    getAllUsers: function () {
        return userModel.findAll();
    },

    // Obtener un usuario por ID
    getUserById: function (id) {
        const validId = this.normalizeId(id);
        return userModel.findById(validId);
    },

    // Actualizar usuario
    updateUser: function (id, data) {
        const validId = this.normalizeId(id);

        if (!data || !data.name || !data.email) {
            const error = new Error('Nombre y email son obligatorios.');
            error.status = 400;
            throw error;
        }

        const user = userModel.findById(validId);
        if (!user) {
            return null;
        }

        userModel.update(validId, {
            name: data.name.trim(),
            email: data.email.trim().toLowerCase()
        });

        return userModel.findById(validId);
    },

    // Eliminar usuario
    deleteUser: function (id) {
        const validId = this.normalizeId(id);
        const user = userModel.findById(validId);
        if (!user) {
            return null;
        }

        userModel.delete(validId);
        return true;
    },

    // Obtener el conteo total para las métricas del Dashboard
    getTotalUsersCount: function () {
        const result = userModel.count();
        return result.total;
    }
};

module.exports = userService;
