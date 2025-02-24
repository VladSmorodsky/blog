const {catchAsync} = require("../util/catchAsync");
const AppError = require("../errors/AppError");
const User = require('../models/user');
const bcrypt= require('bcryptjs');

exports.createUser = catchAsync(async (req, res, next) => {
    const {firstName, lastName, email, password, passwordConfirm} = req.body;

    if (password !== passwordConfirm) {
        return next(new AppError(400, 'Password is not confirmed'))
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
        firstName, lastName, email, password: hashedPassword
    });

    res.status(201).json({
        status: 'success',
        data: {
            firstName,
            lastName,
            email
        }
    });
})

exports.getUser = catchAsync(async (req, res, next) => {
    const user = await User.findByPk(req.params.id);

    if (!user) {
        return next(new AppError(404, 'User not found'));
    }

    res.status(200).json({
        status: 'success',
        data: user
    });
})

exports.getUsers = catchAsync( async (req, res, next) => {
    const users = await User.findAll({attributes: ['id', 'firstName', 'lastName', 'email']});

    res.status(200).json({
        status: 'success',
        data: users
    });
})

exports.updateUser = catchAsync( async (req, res, next) => {
    const user = await User.findByPk(req.params.id);

    if (!user) {
        return next(new AppError(404, 'User not found'));
    }

    const {firstName, lastName, email} = req.body;

    await user.update({firstName, lastName, email});

    res.status(200).json({
        status: 'success',
        data: user
    });
})

exports.deleteUser = catchAsync(async (req, res, next) => {
    const user = await User.findByPk(req.params.id);

    if (!user) {
        return next(new AppError(404, 'User not found'));
    }

    await user.destroy();

    res.status(204).json();
})