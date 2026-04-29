/*
Este Middleware se encarga de inicializar el carrito de compra 
 */
module.exports = (req, res, next) => {
    // Verificamos de forma segura la sesión y el carrito
    if (req.session) {
        if (!req.session.cart || !Array.isArray(req.session.cart)) {
            req.session.cart = [];
        }
        res.locals.cartCount = req.session.cart.reduce((total, item) => total + (item.quantity || 0), 0);
    } else {
        res.locals.cartCount = 0;
    }
    //next para pasarle el control al siguiente middleware o a la ruta
    next();

}