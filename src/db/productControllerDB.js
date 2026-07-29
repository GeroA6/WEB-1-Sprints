const db = require('./database');

// Preparar las consultas SQLite
const insertCategory = db.prepare(`INSERT OR IGNORE INTO categories (name) VALUES (?)`);
const getCategory = db.prepare(`SELECT id FROM categories WHERE name = ?`);

const insertProductQuery = db.prepare(`
    INSERT OR IGNORE INTO products
    (id, name, price, description, image, stock, category_id, masPedidos)
    VALUES (?,?,?,?,?,?,?,?)
`);

const clearProducts = db.prepare(`DELETE FROM products`);
const clearCategories = db.prepare(`DELETE FROM categories`);
const resetIncrementals = db.prepare(`DELETE FROM sqlite_sequence WHERE name IN ('products', 'categories')`);

const productController = {
    resetDatabase: () => {
        clearProducts.run();
        clearCategories.run();
        resetIncrementals.run();
    },

    saveCategory: (name) => {
        insertCategory.run(name);
        return getCategory.get(name).id;
    },

    saveProduct: (product, categoryId) => {
        const isMasPedidos = (product.masPedidos === true || product.masPedido === true) ? 1 : 0;
        
        insertProductQuery.run(
            product.id, product.name, product.price, product.description,
            product.image, product.stock, categoryId, isMasPedidos
        );
    },

    // Funcion para guardar multiples productos dentro de una transaccion
    migrateProduct: (productsArray) => {
        const migrate = db.transaction((products) => {
            productController.resetDatabase();

            for (const prod of products){
                const categoryId = productController.saveCategory(prod.category);
                productController.saveProduct(prod, categoryId);
            }
        });

        migrate(productsArray);
    }
};

module.exports = productController;
