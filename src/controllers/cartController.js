// importamos el servicio de carrito que acabamos de crear
const cartService = require('../services/cartService');

const cartController = {
    
    // ESCENARIO 1: Agregar al carrito
    addCart: (req, res) => {
        // Le pasamos la sesión entera y el id al servicio para que haga la lógica
        cartService.addProduct(req.session, productId);

        // Redirigimos al usuario a la página del carrito para que vea lo que agregó
        res.redirect('/cart');
    },

    // ESCENARIO 2: Ver el Carrito
    viewCart: (req, res) => {
        
        // El servicio nos devuelve el carrito detallado y el total ya calculado
        const { cartWithDetails, total } = cartService.getCartDetails(req.session);

        // Le mandamos los datos al EJS para que los muestre en la vista (controlador -> vista) 
        res.render('pages/cart', { 
            cart: cartWithDetails, 
            total: total,
            isAuthPage: false
        });
    },

    // ESCENARIO 4: Vaciar el carrito
    clearCart: (req, res) => {
        // El servicio se encarga de vaciarlo
        cartService.clearCart(req.session);
        res.redirect('/cart');
    }
};

module.exports = cartController;