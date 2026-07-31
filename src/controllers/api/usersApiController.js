const userService = require('../../services/userService');

const usersApiController = {
    // GET /api/users -> 200 OK
    getAll: (req, res) => {
        try {
            const users = userService.getAllUsers();
            res.status(200).json(users);
        } catch (error) {
            console.error('Error al obtener usuarios: ', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    },

    // GET /api/users/:id -> 200 OK o 404 Not Found
    getById: (req, res) => {
        try {
            const { id } = req.params;
            const user = userService.getUserById(id);
            if (!user) {
                return res.status(404).json({ error: 'Usuario no encontrado' });
            }
            res.status(200).json(user);
        } catch (error) {
            if (error.status === 400) {
                return res.status(400).json({ error: error.message });
            }
            console.error('Error al obtener usuario: ', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    },

    // POST /api/users -> 201 Created (Registro vía API)
    create: (req, res) => {
        try {
            const newUser = userService.registerUser(req.body);
            res.status(201).json(newUser);
        } catch (error) {
            if (error.status === 400) {
                return res.status(400).json({ error: error.message });
            }
            console.error('Error al registrar usuario: ', error);
            res.status(500).json({ error: 'Error interno al registrar usuario' });
        }
    },

    // PUT /api/users/:id -> 200 OK
    update: (req, res) => {
        try {
            const { id } = req.params;
            const updatedUser = userService.updateUser(id, req.body);
            if (!updatedUser) {
                return res.status(404).json({ error: 'Usuario no encontrado' });
            }
            res.status(200).json(updatedUser);
        } catch (error) {
            if (error.status === 400) {
                return res.status(400).json({ error: error.message });
            }
            console.error('Error al actualizar usuario: ', error);
            res.status(500).json({ error: 'Error interno al actualizar usuario' });
        }
    },

    // DELETE /api/users/:id -> 200 OK
    delete: (req, res) => {
        try {
            const { id } = req.params;
            const result = userService.deleteUser(id);
            if (!result) {
                return res.status(404).json({ error: 'Usuario no encontrado' });
            }
            res.status(200).json({ mensaje: 'Usuario eliminado con éxito' });
        } catch (error) {
            if (error.status === 400) {
                return res.status(400).json({ error: error.message });
            }
            console.error('Error al eliminar usuario: ', error);
            res.status(500).json({ error: 'Error interno al eliminar usuario' });
        }
    }
};

module.exports = usersApiController;
