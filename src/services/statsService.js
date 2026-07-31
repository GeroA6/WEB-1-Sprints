const productModel = require('../models/productModel');
const categoryModel = require('../models/categoryModel');

const statsService = {

    getStats: function () {

        return {

            totalProducts: productModel.count(),

            totalCategories: categoryModel.count()

        };

    }

};

module.exports = statsService;