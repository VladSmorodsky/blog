const express = require('express');
const router = express.Router();
const {getCategories, createCategory, updateCategory, deleteCategory} = require('../controllers/categories');

router.route('/categories')
    .get(getCategories)
    .post(createCategory)

router.route('/categories/:id')
    .put(updateCategory)
    .delete(deleteCategory)

module.exports = router;