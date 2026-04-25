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
    //next para pasarle el control al siguiente middleware o a la ruta
    next();

}