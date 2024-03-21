const express = require('express');
const router = express.Router();
const {getCategories, createCategory, updateCategory, deleteCategory} = require('../controllers/categoryController');
const {protected} = require("../middlewares/authMiddleware");

router.route('/categories')
    .get(getCategories)
    .post(protected, createCategory)

router.route('/categories/:id')
    .put(protected, updateCategory)
    .delete(protected, deleteCategory)

module.exports = router;