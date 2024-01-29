const Category = require('../models/category');

exports.getCategories = async (req, res, next) => {
    const categories = await Category.findAll();

    res.status(200).json({
        status: 'success',
        data: categories
    });
}

exports.createCategory = async (req, res, next) => {
    const {title} = req.body;
    const category = await Category.create({
        title
    })

    res.status(201).json({
        status: 'success',
        data: category
    });
}

exports.updateCategory = async (req, res, next) => {
    const {title} = req.body;
    const categoryId = req.params.id;

    const existedCategory = await Category.findByPk(categoryId);

    if (!existedCategory) {
        throw new Error('Category not found');
    }

    await existedCategory.update({title});

    res.status(200).json({
        status: 'success',
        data: existedCategory
    });
}

exports.deleteCategory = async (req, res, next) => {
    const categoryId = req.params.id;

    const existedCategory = await Category.findByPk(categoryId);

    if (!existedCategory) {
        throw new Error('Category not found');
    }

    await existedCategory.destroy();

    res.status(204).json();
}