const Post = require('../models/post');
const Category = require('../models/category');
const AppError = require("../errors/AppError");
const {catchAsync} = require("../util/catchAsync");

const postsPerPage = 9;

exports.getPosts = catchAsync(async (req, res, next) => {
    const page = req.query.page ?? 1;
    const offset= (page - 1) * postsPerPage;
    const postsCount = await Post.count();

    if (postsCount <= offset) {
        return next(new AppError(404, 'Page not found'));
    }

    const posts = await Post.findAll({include: Category, limit: postsPerPage, offset: offset });

    res.status(200).json({
        status: 'success',
        data: posts
    });
})

exports.createPost = catchAsync(async (req, res, next) => {
    const {title, categoryId, content} = req.body;
    const post = await Post.create({
        title,
        content,
        categoryId
    });

    res.status(201).json({
        status: 'success',
        data: post
    });
})

exports.getPost = catchAsync(async (req, res, next) => {
    const postId = req.params.id;

    const post = await Post.findByPk(postId);

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

    await existedPost.update({title, categoryId, content})

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