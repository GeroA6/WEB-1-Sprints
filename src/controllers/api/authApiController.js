const jwt = require('jsonwebtoken');
const userService = require('../../services/userService');

const JWT_SECRET = process.env.JWT_SECRET || process.env.secret || 'NegraSecreTone_JWT_2026_Key';

const authApiController = {
    /**
     * Iniciar sesión desde la API (Dashboard o clientes externos)
     * POST /api/auth/login
     */
    login: (req, res) => {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({
                    error: 'Debes proporcionar un email y una contraseña.'
                });
            }

            // Validar credenciales usando userService (verifica bcrypt)
            const user = userService.loginUser(email, password);

            // Verificar si el usuario tiene rol de administrador para acceder al panel
            if (user.role && user.role !== 'admin') {
                return res.status(403).json({
                    error: 'Acceso denegado. Tu cuenta no tiene permisos de administrador para acceder al panel de control.'
                });
            }

            // Generar el Token JWT con payload y tiempo de expiración
            const token = jwt.sign(
                {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role || 'admin'
                },
                JWT_SECRET,
                { expiresIn: '8h' }
            );

            return res.json({
                message: 'Autenticación exitosa',
                token,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role || 'admin'
                }
            });
        } catch (error) {
            const status = error.status || 401;
            return res.status(status).json({
                error: error.message || 'Error de autenticación'
            });
        }
    },

    /**
     * Verificar la validez del token actual
     * GET /api/auth/verify
     */
    verify: (req, res) => {
        return res.json({
            valid: true,
            user: req.user
        });
    }
};

module.exports = authApiController;
