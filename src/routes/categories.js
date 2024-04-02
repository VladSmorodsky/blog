const express = require('express');
const router = express.Router();
const {getCategories, createCategory, updateCategory, deleteCategory} = require('../controllers/categoryController');
const {protectedRoute} = require("../middlewares/authMiddleware");

router.route('/categories')
    .get(getCategories)
    .post(protectedRoute, createCategory)

router.route('/categories/:id')
    .put(protectedRoute, updateCategory)
    .delete(protectedRoute, deleteCategory)

module.exports = router;