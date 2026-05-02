// importamos el servicio de carrito que acabamos de crear
const cartService = require('../services/cartService');
// Importamos el servicio de productos para utilizar la función normalizeId
const productService = require('../services/productService');

const cartController = {
    
    // ESCENARIO 1: Agregar al carrito
    addCart: (req, res) => {
        const productId = req.params.id; // Obtenemos el id del producto desde la ruta (ej: /cart/add/2)
        // Le pasamos la sesión entera y el id al servicio para que haga la lógica
        cartService.addProduct(req.session, productId);

        // Redirigimos al usuario a la página del carrito para que vea lo que agregó
        res.redirect('/cart');
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
    },

    // ESCENARIO 3: Modificar cantidad (+ o -)
    updateCart: (req, res) => {
        const productId = req.params.id;
        // Obtenemos la acción desde la query string (ej: /cart/update/2?action=increase)
        const action = req.query.action; 

        cartService.updateQuantity(req.session, productId, action);
        
        res.redirect('/cart');
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
    removeItem: (req, res) => {
        const productId = req.params.id;

        cartService.removeProduct(req.session, productId);
        
        res.redirect('/cart');
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