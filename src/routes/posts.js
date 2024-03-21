const express = require('express');
const router = express.Router();
const {getPosts, createPost, getPost, deletePost, editPost} = require ('../controllers/postController');
const {protected} = require("../middlewares/authMiddleware");

router.route('/posts')
    .get(getPosts)
    .post(protected, createPost);

router.route('/posts/:id')
    .get(getPost)
    .put(protected, editPost)
    .delete(protected, deletePost);

module.exports = router;