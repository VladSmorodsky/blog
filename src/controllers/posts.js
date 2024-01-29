const Post = require('../models/post');
const Category = require('../models/category');

exports.getPosts = async (req, res, next) => {
    const posts = await Post.findAll({include: Category});
    res.status(200).json({
        status: 'success',
        data: posts
    });
}

exports.createPost = async (req, res, next) => {
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
}

exports.getPost = async (req, res, next) => {
    const postId = req.params.id;

    const post = await Post.findByPk(postId);

    if (!post) {
        throw new Error('Post not found');
    }

    res.status(200).json({
        status: 'success',
        data: post
    });
}

exports.editPost = async (req, res, next) => {
    const {title, categoryId, content} = req.body;
    const postId = req.params.id;

    const existedPost = await Post.findByPk(postId);

    if (!existedPost) {
        throw new Error('Post not found');
    }

    await existedPost.update({title, categoryId, content})

    res.status(200).json({
        status: 'success',
        data: existedPost
    });
}

exports.deletePost = async (req, res, next) => {
    const postId = req.params.id;
    const existedPost = await Post.findByPk(postId);

    if (!existedPost) {
        throw new Error('Post not found');
    }

    await existedPost.destroy();

    res.status(204).json();
}