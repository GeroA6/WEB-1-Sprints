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
        // --- INICIO DE LA VALIDACIÓN DE STOCK (US 11) ---
        // Obtenemos el producto completo para verificar su stock
        const productToAdd = productsService.getProductById(productId);

        // Si el producto no existe o su stock es 0, no hacemos nada.
        if (!productToAdd || productToAdd.stock === 0) {
            console.warn(`Intento de agregar al carrito un producto sin stock o inexistente. ID: ${productId}`);
            return; // Detenemos la ejecución de la función aquí.
        }
        // --- FIN DE LA VALIDACIÓN DE STOCK ---

        cartService.initCart(session);
        
        // Buscamos si ese producto ya está guardado en el carrito de la sesión
        const existingItem = session.cart.find(item => item.productId == productId);

        if (existingItem) {
            // Si ya existe, solo le sumamos 1 a la cantidad
           if (existingItem.quantity < productToAdd.stock) {
                existingItem.quantity += 1;
            }
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
    },

    // ESCENARIO 3: Aumentar o disminuir cantidades
    //pasamos la sesión, el id del producto y la acción (aumentar o disminuir)
    updateQuantity: (session, productId, action) => {
        //Inicializamos el carrito si no existe
        cartService.initCart(session);
        
        // Buscamos el índice del producto en el carrito
        const itemIndex = session.cart.findIndex(item => item.productId == productId);

        // Traemos el producto para saber su stock máximo
        const product = productsService.getProductById(productId);

        // Si encontramos el producto, actualizamos la cantidad según la acción
        if (itemIndex !== -1 && product) {
            if (action === 'increase') {
                if (session.cart[itemIndex].quantity < product.stock) {
                    session.cart[itemIndex].quantity += 1;
                }
            } else if (action === 'decrease') {
                session.cart[itemIndex].quantity -= 1;
                
                // Si la cantidad llega a 0, usamos splice para eliminarlo del array
                if (session.cart[itemIndex].quantity <= 0) {
                    session.cart.splice(itemIndex, 1);
                }
            }
        }
    },

    // Quitar un producto específico del carrito (Botón "Quitar")
    removeProduct: (session, productId) => {
        cartService.initCart(session);
        
        // Filtramos el array dejando todos los productos MENOS el que queremos eliminar
        session.cart = session.cart.filter(item => item.productId != productId);
    }
};

module.exports = cartService;