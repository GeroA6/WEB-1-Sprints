const fs = require('fs');
const path = require('path');

// Traigo database.js. Al hacer esto, también me aseguro de que se creen las tablas 
// (si no existen) gracias al db.exec(schema) que ya armé ahí.
const db = require('./database');

const productsJsonPath = path.join(__dirname, '../data/products.json');

try {
    console.log("iniciando migración de datos...");

    // leo y convierto el archivo products.json para poder usar sus datos.
    const productsData = fs.readFileSync(productsJsonPath, 'utf-8');
    const products = JSON.parse(productsData);

    // Preparo las consultas de SQLite.
    // INSERT OR IGNORE para no tener problemas y duplicar datos si es que se ejecuta mas de una vez.
    const insertCategory = db.prepare(`INSERT OR IGNORE INTO categories (name) VALUES (?)`);
    const getCategory = db.prepare(`SELECT id FROM categories WHERE name = ?`);

    const insertProduct = db.prepare(`
        INSERT OR IGNORE INTO products 
        (id, name, price, description, image, stock, category_id, masPedidos)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    // Preparación de sentencias para truncar tablas
    const clearProducts = db.prepare(`DELETE FROM products`);
    const clearCategories = db.prepare(`DELETE FROM categories`);

    // operacion que activa el truncate optimizer de SQLite para reiniciar los auto-incrementales.
    const resetIncrementals = db.prepare(`DELETE FROM sqlite_sequence WHERE name IN ('products', 'categories')`);

    // Se ejecuta todo dentro de una transacción para que sea más rápido y seguro (se hace todo o no se hace nada).
    const migrate = db.transaction((productsArray) => {
        
        // truncamos para que al migrar del json no se ignore algun cambio en un atributo de un producto que ya estaba en la base de datos.
        clearProducts.run();
        clearCategories.run();
        resetIncrementals.run();  

        for (const prod of productsArray) {

            
            // guarda la categoría del producto si es que todavía no existe en la tabla.
            insertCategory.run(prod.category);
            
            // busca el ID de esa categoría (ya sea la que se acaba de insertar o la que ya estaba).
            const categoryRow = getCategory.get(prod.category);
            const categoryId = categoryRow.id;

            // manejar el booleano y el pequeño error de tipeo en el JSON (masPedido vs masPedidos)
            const isMasPedidos = (prod.masPedidos === true || prod.masPedido === true) ? 1 : 0;

            // inserta el producto en la base de datos manteniendo el ID que traía del JSON.
            insertProduct.run(
                prod.id, prod.name, prod.price, prod.description, 
                prod.image, prod.stock, categoryId, isMasPedidos
            );
        }
    });

    //invoco la función de migración con el array de productos que leí del JSON.
    migrate(products);
    console.log("Migración completada con éxito");

} catch (error) {
    console.error("Hubo un error en la migración:", error);
}
