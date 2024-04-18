const {catchAsync} = require("../util/catchAsync");
const AppError = require("../errors/AppError");
const jwt = require('jsonwebtoken');
const {promisify} = require('util');
const User = require('../models/user');
const {createHash} = require('crypto');
const redisClient = require('../util/redisClient');

exports.protectedRoute = catchAsync(async (req, res, next) => {
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

    const authKey = createHash('md5').update(`token:${user.id}${user.firstName}${user.createdAt}`).digest('hex');
    const authToken = await redisClient.get(authKey);

    if (!authToken) {
        return next(new AppError(404, 'User not found'));
    }

    if (authToken !== token) {
        return next(new AppError(401, 'Please login to the system'));
    }

    //TODO add case for reseting password
    req.user = user;

    next();
})