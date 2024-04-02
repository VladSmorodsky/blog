const express = require('express');
const {createUser, getUser, getUsers, updateUser, deleteUser} = require("../controllers/userController");
const {protectedRoute} = require("../middlewares/authMiddleware");
const router = express.Router();


router.route('/users')
    .get(protectedRoute, getUsers)
    .post(protectedRoute, createUser);

router.route('/users/:id')
    .get(protectedRoute, getUser)
    .put(protectedRoute, updateUser)
    .delete(protectedRoute, deleteUser);

module.exports = router;