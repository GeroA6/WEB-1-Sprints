const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || process.env.secret || 'NegraSecreTone_JWT_2026_Key';

/**
 * Middleware para validar tokens JWT en peticiones a la API REST.
 * Requiere el encabezado: Authorization: Bearer <token>
 */
module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            error: 'Acceso no autorizado. Se requiere un token JWT válido (Formato: Bearer <token>).'
        });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                error: 'El token ha expirado. Por favor, inicia sesión nuevamente.'
            });
        }
        return res.status(401).json({
            error: 'Token inválido o corrupto. Acceso denegado.'
        });
    }
};
