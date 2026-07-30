const categoryService = require('../../services/categoryService');

const categoriesApiController = {
    // GET /api/categories -> 200 OK
    getAll: (req, res) => {
        try {
            const categories = categoryService.getAllCategories();
            res.status(200).json(categories);
        } catch (error) {
            console.error('Error al obtener categorías: ', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    },

    // GET /api/categories/:id -> 200 OK o 404 Not Found
    getById: (req, res) => {
        try {
            const { id } = req.params;
            const category = categoryService.getCategoryById(id);
            if (!category) {
                return res.status(404).json({ error: 'Categoría no encontrada' });
            }
            res.status(200).json(category);
        } catch (error) {
            if (error.status === 400) {
                return res.status(400).json({ error: error.message });
            }
            console.error("Error al obtener la categoría:", error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    },

    // POST /api/categories -> 201 Created
    create: (req, res) => {
        try {
            const newCategory = categoryService.createCategory(req.body);
            res.status(201).json(newCategory);
        } catch (error) {
            if (error.status === 400) {
                return res.status(400).json({ error: error.message });
            }
            console.error('Error al crear la categoría: ', error);
            res.status(500).json({ error: 'Error interno al crear la categoría' });
        }
    },

    // PUT /api/categories/:id -> 200 OK
    update: (req, res) => {
        try {
            const { id } = req.params;
            const updatedCategory = categoryService.updateCategory(id, req.body);
            if (!updatedCategory) {
                return res.status(404).json({ error: 'Categoría no encontrada' });
            }
            res.status(200).json(updatedCategory);
        } catch (error) {
            if (error.status === 400) {
                return res.status(400).json({ error: error.message });
            }
            console.error('Error al actualizar la categoría: ', error);
            res.status(500).json({ error: 'Error interno al actualizar la categoría' });
        }
    },

    // DELETE /api/categories/:id -> 200 OK
    delete: (req, res) => {
        try {
            const { id } = req.params;
            const result = categoryService.deleteCategory(id);
            if (!result) {
                return res.status(404).json({ error: 'Categoría no encontrada' });
            }
            res.status(200).json({ mensaje: 'Categoría eliminada con éxito' });
        } catch (error) {
            if (error.status === 400) {
                return res.status(400).json({ error: error.message });
            }
            console.error('Error al eliminar la categoría: ', error);
            res.status(500).json({ error: 'Error interno al eliminar la categoría' });
        }
    }
};

module.exports = categoriesApiController;