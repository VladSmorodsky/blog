const express = require('express');
const router = express.Router();
const {getCategories, createCategory, updateCategory, deleteCategory, getCategory} = require('../controllers/categoryController');
const {protectedRoute} = require("../middlewares/authMiddleware");

router.route('/categories')
    .get(getCategories)
    .post(protectedRoute, createCategory);

router.route('/categories/:id')
    .get(getCategory)
    .put(protectedRoute, updateCategory);

router.route('/categories/:id/replace/:newCategoryId?')
    .delete(protectedRoute, deleteCategory);

module.exports = router;