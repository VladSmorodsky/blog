const {catchAsync} = require("../util/catchAsync");
const User = require("../models/user");
const AppError = require("../errors/AppError");
const bcrypt = require('bcryptjs');
const json = require('jsonwebtoken');

exports.login = catchAsync(async (req, res, next) => {
    const {email: userEmail, password} = req.body;

    const user = await User.findOne({ where: {email: userEmail}});

    if (!user) {
        return next(new AppError(400, 'Wrong user credentials'));
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
        return next(new AppError(400, 'Wrong user credentials'));
    }

    const token = await json.sign({id: user.id}, process.env.TOKEN_SECRET, {
        expiresIn: process.env.TOKEN_TTL
    });

    const {firstName, lastName, email} = user;

    return res
        .cookie('jwt', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'prod'
        })
        .status(200)
        .json({
            status: 'success',
            data: {
                firstName,
                lastName,
                email
            }
        });
})