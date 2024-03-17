const express = require('express');
const {createUser, getUser, getUsers, updateUser, deleteUser} = require("../controllers/users");
const router = express.Router();


router.route('/users')
    .get(getUsers)
    .post(createUser);

router.route('/users/:id')
    .get(getUser)
    .put(updateUser)
    .delete(deleteUser);

module.exports = router;