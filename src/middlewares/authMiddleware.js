/**
 * Middleware de autenticación
 * Verifica si existe un usuario autenticado en req.session.user.
 * Si no está autenticado:
 * - Para peticiones AJAX/JSON: responde con status 401.
 * - Para peticiones de navegador: redirige a /login.
 */
module.exports = (req, res, next) => {
    if (req.session && req.session.user) {
        return next();
    }

    // Si la petición espera una respuesta JSON (p. ej. llamada AJAX/Fetch)
    if (req.xhr || (req.headers.accept && req.headers.accept.includes('application/json'))) {
        return res.status(401).json({
            error: 'Debes iniciar sesión para realizar esta acción.'
        });
    }

    // Redireccionar al login para peticiones normales de navegación/formulario
    return res.redirect('/login');
};
