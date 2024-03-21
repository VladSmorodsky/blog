const {catchAsync} = require("../util/catchAsync");
const AppError = require("../errors/AppError");
const jwt = require('jsonwebtoken');
const {promisify} = require('util');
const User = require('../models/user');

exports.protected = catchAsync(async (req, res, next) => {
    let token;
    const {authorization} = req.headers;

    if (authorization && authorization.startsWith('Bearer')) {
        token = authorization.split(' ')[1];
    }

    if (!token) {
        return next(new AppError(401, 'User is not logged in'))
    }

    const {id} = await promisify(jwt.verify)(token, process.env.TOKEN_SECRET);
    const user = await User.findByPk(id);

    if (!user) {
        return next(new AppError(404, 'User not found'));
    }

    //TODO add case for reseting password
    req.user = user;

    next();
})