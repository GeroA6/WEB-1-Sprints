/*
Este Middleware se encarga de inicializar el carrito de compra 
 */
module.exports = (req, res, next) => {
    //Inicializo carrito si no existe para esta sesion
    if (!req.session.cart) {
        req.session.cart = [];
    }
    // guardo en el cliente la cantidad de productos en el carrito, reduce() cumple el rol de un contador, va sumando la cantidad de cada item del carrito y devuelve el total
    res.locals.cartCount = req.session.cart.reduce((total, item) => total + item.quantity, 0);

    // Helper universal para formatear URLs de imágenes (soporta Base64, URLs remotas, rutas relativas y nombres de archivo)
    res.locals.formatImgUrl = (img) => {
        if (!img) return '/img/default-product.png';
        if (img.startsWith('data:') || img.startsWith('http://') || img.startsWith('https://')) {
            return img;
        }
        if (img.startsWith('/img/')) return img;
        if (img.startsWith('img/')) return '/' + img;
        if (img.startsWith('/')) return img;
        return '/img/' + img;
    };

    // Disponibilizamos la información del usuario logueado en todas las vistas
    res.locals.user = req.session.user || null;
    res.locals.isLoggedIn = !!req.session.user;

    //next para pasarle el control al siguiente middleware o a la ruta
    next();
};