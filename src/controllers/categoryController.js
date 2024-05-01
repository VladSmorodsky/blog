const Category = require('../models/category');
const AppError = require("../errors/AppError");
const {catchAsync} = require("../util/catchAsync");
const Post = require("../models/post");

exports.getCategories = catchAsync(async (req, res, next) => {
    const categories = await Category.findAll();

    res.status(200).json({
        status: 'success',
        data: categories
    });
})

exports.getCategory = catchAsync(async (req, res, next) => {
    const categoryId = req.params.id;
    const category = await Category.findByPk(categoryId);

    if (!category) {
        return next(new AppError(404, 'Category not found'));
    }

    res.status(200).json({
        status: 'success',
        data: category
    });
})

exports.createCategory = catchAsync(async (req, res, next) => {
    const {title} = req.body;
    const category = await Category.create({
        title
    })

    res.status(201).json({
        status: 'success',
        data: category
    });
})

exports.updateCategory = catchAsync(async (req, res, next) => {
    const {title} = req.body;
    const categoryId = req.params.id;

    const existedCategory = await Category.findByPk(categoryId);

    if (!existedCategory) {
        return next(new AppError(404, 'Category not found'));
    }

    await existedCategory.update({title});

    res.status(200).json({
        status: 'success',
        data: existedCategory
    });
})

exports.deleteCategory = catchAsync(async (req, res, next) => {
    const categoryId = req.params.id;
    const newCategoryId = req.params.newCategoryId;

    console.log('[bode]', newCategoryId)

    const deletedCategory = await Category.findByPk(categoryId);

    if (!deletedCategory) {
        return next(new AppError(404, 'Category not found'));
    }

    const newCategory = await Category.findByPk(newCategoryId);

    if (!newCategory) {
        return next(new AppError(404, 'New Category not found'));
    }

    await Post.update({categoryId: newCategoryId}, {where: {categoryId: categoryId}});

    await deletedCategory.destroy();

    res.status(204).json();
})