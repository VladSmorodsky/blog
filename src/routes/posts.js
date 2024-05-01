const express = require('express');
const router = express.Router();
const {getPosts, createPost, getPost, deletePost, editPost, uploadPostImages} = require ('../controllers/postController');
const {protectedRoute} = require("../middlewares/authMiddleware");

router.route('/posts')
    .get(getPosts)
    .post(protectedRoute, uploadPostImages, createPost);

router.route('/posts/:id')
    .get(getPost)
    .put(protectedRoute, uploadPostImages, editPost)
    .delete(protectedRoute, deletePost);

module.exports = router;