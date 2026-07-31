const productModel = require('../models/productModel');
const categoryModel = require('../models/categoryModel');

const statsService = {

    getStats: function () {

        return {
            // TODO sugerencia, retorna un objeto, por lo que se deberia retornar la propiedad ".total"
            totalProducts: productModel.count(),

            totalCategories: categoryModel.count()

        };

    }

};

module.exports = statsService;