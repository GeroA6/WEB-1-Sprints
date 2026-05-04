// importamos el servicio de carrito
const cartService = require('../services/cartService');
// Importamos el servicio de productos para utilizar la función normalizeId
const productService = require('../services/productService');

const cartController = {
    
    // ESCENARIO 1: Agregar al carrito
    addCart: (req, res, next) => {
        try {
            // Normalizamos y validamos el ID antes de agregarlo al carrito
            const productId = productService.normalizeId(req.params.id);
            
            cartService.addProduct(req.session, productId);
            res.redirect('/cart');
        } catch (error) {
            next(error);
        }
    },

    // ESCENARIO 2 y 5: Ver el Carrito
    viewCart: (req, res) => {
        // El servicio nos devuelve el carrito detallado y el total ya calculado
        const { cartWithDetails, total } = cartService.getCartDetails(req.session);

        // Le mandamos los datos al EJS para que los muestre en la vista
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
    },

    // ESCENARIO 3: Modificar cantidad (+ o -)
    updateCart: (req, res, next) => {
        try {
            // Validamos el ID
            const productId = productService.normalizeId(req.params.id);
            const action = req.query.action; 
    
            cartService.updateQuantity(req.session, productId, action);
            res.redirect('/cart');
        } catch (error) {
            next(error);
        }
    },

    // Quitar un producto específico
    removeItem: (req, res, next) => {
        try {
            // Validamos el ID
            const productId = productService.normalizeId(req.params.id);
    
            cartService.removeProduct(req.session, productId);
            res.redirect('/cart');
        } catch (error) {
            next(error);
        }
    }
};

module.exports = cartController;