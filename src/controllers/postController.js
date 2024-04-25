const Post = require('../models/post');
const Category = require('../models/category');
const AppError = require("../errors/AppError");
const {catchAsync} = require("../util/catchAsync");
const multer = require('multer');
const sharp = require('sharp');
const {mkdirSync, existsSync, promises} = require("fs");
const {resolve} = require("path");

const postsPerPage = 9;

const storage = multer.memoryStorage();
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true);
    } else {
        cb(new AppError(400, 'Please provide a correct image file'));
    }
}

const upload = multer({
    storage: storage,
    fileFilter: fileFilter
});

exports.uploadPostImages = upload.fields([
    {name: 'imageCover', max: 1}
]);

exports.getPosts = catchAsync(async (req, res, next) => {
    const categoryId = req.query.category ?? null;
    const page = req.query.page * 1 || 1;
    const offset= (page - 1) * postsPerPage;

    let whereOptions = {};
    if (categoryId) {
        whereOptions.categoryId = categoryId;
    }

    const posts = await Post.findAll({
        attributes: ['id', 'title', 'imageCover'],
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

    const imageCover = req.files.imageCover.length ? req.files.imageCover[0] : null

    const post = await Post.create({
        title,
        content: JSON.stringify(content),
        categoryId,
        imageCover: imageCover ? imageCover.originalname : null,
        userId: req.user.id
    });

    if (imageCover) {
        const postImagesPath = await createPostImageFolder(post);

        await sharp(imageCover.buffer)
            .resize(500, 300)
            .toFormat('png')
            .png({quality: 100})
            .toFile(`${postImagesPath}/${imageCover.originalname}`);
    }

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

    //TODO add removing the post image directory

    res.status(204).json();
})

const createPostImageFolder = async (post) => {
    const imagesPath = resolve(`${process.env.IMAGES_PATH}/${post.id}`);
    try {
        console.log('[path]', imagesPath);

        const stat = await promises.stat(imagesPath);

        if (stat.isDirectory()) {
            return imagesPath;
        }
    } catch (err) {
        if (err.code === 'ENOENT') {
            // Directory does not exist, so create it
            try {
                await promises.mkdir(imagesPath, { recursive: true });

                return imagesPath;
            } catch (err) {
                throw new AppError(500, 'Error with creating directory');
            }
        } else {
            throw new AppError(500, 'Error with creating directory');
        }
    }
}