const Post = require('../models/post');
const Category = require('../models/category');
const AppError = require("../errors/AppError");
const {catchAsync} = require("../util/catchAsync");

const postsPerPage = 3;

exports.getPosts = catchAsync(async (req, res, next) => {
    const categoryId = req.query.category ?? null;
    const page = req.query.page * 1 || 1;
    const offset= (page - 1) * postsPerPage;

    let whereOptions = {};
    if (categoryId) {
        whereOptions.categoryId = categoryId;
    }

    const posts = await Post.findAll({
        attributes: ['id', 'title'],
        include: Category, limit: postsPerPage, offset: offset,
        where: whereOptions,
        order: [['createdAt', 'DESC']]
    });

    const postsCount = await Post.count({
        where: whereOptions
    });

    res.status(200).json({
        status: 'success',
        data: posts,
        pagination: {
            page: page,
            totalRows: postsCount,
            rowsPerPage: postsPerPage
        }
    });
})

exports.createPost = catchAsync(async (req, res, next) => {
    const {title, categoryId, content} = req.body;
    const post = await Post.create({
        title,
        content: JSON.stringify(content),
        categoryId,
        userId: req.user.id
    });

    res.status(201).json({
        status: 'success',
        data: post
    });
})

exports.getPost = catchAsync(async (req, res, next) => {
    const postId = req.params.id;

    const post = await Post.findByPk(postId);
    post.content = JSON.parse(post.content);

    if (!post) {
        return next(new AppError(404, 'Post not found'));
    }

    res.status(200).json({
        status: 'success',
        data: post
    });
})

exports.editPost = catchAsync(async (req, res, next) => {
    const {title, categoryId, content} = req.body;
    const postId = req.params.id;

    const existedPost = await Post.findByPk(postId);

    if (!existedPost) {
        return next(new AppError(404, 'Post not found'));
    }

    await existedPost.update({title, categoryId, content, userId: req.user.id})

    res.status(200).json({
        status: 'success',
        data: existedPost
    });
});

exports.deletePost = catchAsync(async (req, res, next) => {
    const postId = req.params.id;
    const existedPost = await Post.findByPk(postId);

    if (!existedPost) {
        return next(new AppError(404, 'Post not found'));
    }

    await existedPost.destroy();

    res.status(204).json();
})