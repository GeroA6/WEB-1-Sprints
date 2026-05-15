const fs = require('fs');
const path = require('path');

// Traigo database.js. Al hacer esto, también me aseguro de que se creen las tablas 
// (si no existen) gracias al db.exec(schema) que ya armé ahí.
const db = require('./database');

const productsJsonPath = path.join(__dirname, '../data/products.json');

try {
    console.log("🚀 Iniciando migración de datos...");

    // 1. Leo y convierto el archivo products.json para poder usar sus datos.
    const productsData = fs.readFileSync(productsJsonPath, 'utf-8');
    const products = JSON.parse(productsData);

    // 2. Preparo las consultas de SQLite.
    // INSERT OR IGNORE para no tener problemas y duplicar datos si es que se ejecuta mas de una vez.
    const insertCategory = db.prepare(`INSERT OR IGNORE INTO categories (name) VALUES (?)`);
    const getCategory = db.prepare(`SELECT id FROM categories WHERE name = ?`);

    const insertProduct = db.prepare(`
        INSERT OR IGNORE INTO products 
        (id, name, price, description, image, stock, category_id, masPedidos)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    // 3. Se ejecuta todo dentro de una transacción para que sea más rápido y seguro.
    const migrate = db.transaction((productsArray) => {
        for (const prod of productsArray) {
            // A. Guarda la categoría del producto si es que todavía no existe en la tabla.
            insertCategory.run(prod.category);
            
            // B. Busca el ID de esa categoría (ya sea la que se acaba de insertar o la que ya estaba).
            const categoryRow = getCategory.get(prod.category);
            const categoryId = categoryRow.id;

            // C. Manejar el booleano y el pequeño error de tipeo en el JSON (masPedido vs masPedidos)
            const isMasPedidos = (prod.masPedidos === true || prod.masPedido === true) ? 1 : 0;

            // D. Inserta el producto en la base de datos manteniendo el ID que traía del JSON.
            insertProduct.run(
                prod.id, prod.name, prod.price, prod.description, 
                prod.image, prod.stock, categoryId, isMasPedidos
            );
        }
    });

    migrate(products);
    console.log("Migración completada con éxito");

} catch (error) {
    console.error("Hubo un error en la migración:", error);
}
