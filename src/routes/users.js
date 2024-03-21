const express = require('express');
const {createUser, getUser, getUsers, updateUser, deleteUser} = require("../controllers/userController");
const {protected} = require("../middlewares/authMiddleware");
const router = express.Router();


router.route('/users')
    .get(protected, getUsers)
    .post(protected, createUser);

router.route('/users/:id')
    .get(protected, getUser)
    .put(protected, updateUser)
    .delete(protected, deleteUser);

module.exports = router;