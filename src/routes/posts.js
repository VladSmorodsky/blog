const express = require('express');
const router = express.Router();
const {getPosts, createPost, getPost, deletePost, editPost} = require ('../controllers/postController');
const {protectedRoute} = require("../middlewares/authMiddleware");

router.route('/posts')
    .get(getPosts)
    .post(protectedRoute, createPost);

router.route('/posts/:id')
    .get(getPost)
    .put(protectedRoute, editPost)
    .delete(protectedRoute, deletePost);

module.exports = router;