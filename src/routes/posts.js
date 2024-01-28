const express = require('express');
const router = express.Router();
const {getPosts, createPost, getPost, deletePost, editPost} = require ('../controllers/posts');

router.route('/posts')
    .get(getPosts)
    .post(createPost);

router.route('/posts/:id')
    .get(getPost)
    .put(editPost)
    .delete(deletePost);

module.exports = router;