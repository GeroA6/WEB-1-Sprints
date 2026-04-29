// importamos el servicio de productos para leer el JSON
const productsService = require('../services/productService');

const cartController = {
    
    // ESCENARIO 1: Agregar al carrito
    addCart: (req, res) => {
        const productId = req.params.id; // Agarramos el ID de la URL (ej: /cart/add/2), entonces agarrara el '2'
        
        // Buscamos si ese producto ya está guardado en el carrito de la sesión
        const existingItem = req.session.cart.find(item => item.productId == productId);

        if (existingItem) {
            // Si ya existe, solo le sumamos 1 a la cantidad
            existingItem.quantity += 1;
        } else {
            // Si no existe, lo empujamos (push) como un objeto nuevo
            req.session.cart.push({ productId: productId, quantity: 1 });
        }

        // Redirigimos al usuario a la página del carrito para que vea lo que agregó
        res.redirect('/cart');
    },

    // ESCENARIO 2: Ver el Carrito
    viewCart: (req, res) => {
        // Agarramos el carrito de la sesión (si no existe, lo inicializamos como un array vacío)  
        const sessionCart = req.session.cart || [];

        // "Recreamos el objeto": Cruzamos la sesión con el JSON para mostrar toda la info y no solo el id y cantidad
        // Usamos .map() para transformar el array de IDs en un array de productos completos, con imagen y todo
        const cartWithDetails = sessionCart.map(item => {
            // Buscamos el producto real en el JSON usando productsService.getProductById() y el ID que tenemos en la sesión
            const realProduct = productsService.getProductById(item.productId);
            
            // Retornamos un objeto nuevo combinando ambas cosas para que lo vea la vista.
            return {
                id: realProduct.id,
                name: realProduct.name,
                price: realProduct.price,
                image: realProduct.image,
                quantity: item.quantity,
                subtotal: realProduct.price * item.quantity // Calculamos el subtotal
            };
        });

        // Calculamos el Total General (Escenario 5)
        // .reduce() va sumando los subtotales. El '0' es el valor inicial.
        const total = cartWithDetails.reduce((suma, item) => suma + item.subtotal, 0);

        // Le mandamos los datos al EJS para que los muestre en la vista (controlador -> vista) 
        res.render('pages/cart', { 
            cart: cartWithDetails, 
            total: total,
            isAuthPage: false
        });
    },

    // ESCENARIO 4: Vaciar el carrito
    clearCart: (req, res) => {
        // Reiniciamos la sesión a un array vacío
        req.session.cart = [];
        res.redirect('/cart');
    }
};

module.exports = cartController;