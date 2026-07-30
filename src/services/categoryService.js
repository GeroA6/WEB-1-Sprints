const categoryModel = require('../models/categoryModel');

const categoryService = {

    // helper para normalizar y validar IDs
    normalizeId: function (id) {
        const parsedId = parseInt(id, 10);
        if (isNaN(parsedId)) {
            const error = new Error('Formato de ID invalido. Debe ser un numero.');
            error.status = 400;
            throw error;
        }
        return parsedId;
    },

    // Obtiene el listado completo
    getAllCategories: function () {
        return categoryModel.findAll();
    },

    // Obtiene una por ID
    getCategoryById: function (id) {
        const validId = this.normalizeId(id);
        return categoryModel.findById(validId);
    },

    // Crear una categoria
    createCategory: function (data) {
        // valida que el campo "name" exista y no esté vacío
        if (!data || !data.name || data.name.trim() === '') {
            const error = new Error('Error campo "name" es obligatorio.');
            error.status = 400;
            throw error;
        };

        const trimmedName = data.name.trim().toLowerCase();

        // validar que la categoría no exista ya en la base de datos
        const existing = categoryModel.findByName(trimmedName);
        if (existing) {
            const error = new Error(`La categoria "${trimmedName} ya existe.`);
            error.status = 400;
            throw error;
        };

        // crea la categoria
        const result = categoryModel.create(trimmedName);

        // retorna el objeto creado
        return categoryModel.findById(result.lastInsertRowid);
    },

    updateCategory: function (id, data) {

        const validId = this.normalizeId(id);
        if (!data || !data.name || data.name.trim() === '') {
            const error = new Error('El campo "name" es obligatorio');
            error.status = 400;
            throw error;
        }

        // verifica si la categoria existe
        const existing = categoryModel.findById(validId);
        if (!existing) {
            return null; // para que el responda con 404
        }

        categoryModel.update(validId, data.name.trim());
        return categoryModel.findById(validId);
    },

    // Elimina una categoria
    deleteCategory: function (id) {
        const validId = this.normalizeId(id);

        // Verifica si la categoría existe antes de intentar borrarla
        const existing = categoryModel.findById(validId);
        if (!existing) {
            return null;
        }

        // Elimina la categoría
        categoryModel.delete(validId);

        // Devuelve true si se eliminó correctamente
        return true;
    }
};

module.exports = categoryService;