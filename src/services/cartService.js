// importamos el servicio de productos para leer el JSON
const productsService = require('./productService');

const cartService = {
    // Método auxiliar para asegurar que el carrito exista en la sesión
    initCart: (session) => {
        if (!session.cart) {
            session.cart = [];
        }
    },

    // ESCENARIO 1: Agregar al carrito
    addProduct: (session, productId) => {
        cartService.initCart(session);
        
        // Buscamos si ese producto ya está guardado en el carrito de la sesión
        const existingItem = session.cart.find(item => item.productId == productId);

        if (existingItem) {
            // Si ya existe, solo le sumamos 1 a la cantidad
            existingItem.quantity += 1;
        } else {
            // Si no existe, lo empujamos (push) como un objeto nuevo
            session.cart.push({ productId: productId, quantity: 1 });
        }
    },

    // ESCENARIO 2 y 5: Ver el Carrito y calcular Total general
    getCartDetails: (session) => {
        cartService.initCart(session);
        const sessionCart = session.cart;

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

        return { cartWithDetails, total };
    },

    // ESCENARIO 4: Vaciar el carrito
    clearCart: (session) => {
        // Reiniciamos la sesión a un array vacío
        session.cart = [];
    }
};

module.exports = cartService;