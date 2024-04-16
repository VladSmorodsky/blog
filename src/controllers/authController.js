const {catchAsync} = require("../util/catchAsync");
const User = require("../models/user");
const AppError = require("../errors/AppError");
const bcrypt = require('bcryptjs');
const json = require('jsonwebtoken');
const redisClient = require('../util/redisClient');
const {createHash} = require('crypto');

exports.login = catchAsync(async (req, res, next) => {
    const {email: userEmail, password} = req.body;

    const user = await User.findOne({ where: {email: userEmail}});

    if (!user) {
        return next(new AppError(401, 'Wrong user credentials'));
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
        return next(new AppError(401, 'Wrong user credentials'));
    }

    const key = createHash('md5').update(`token:${user.id}${user.firstName}${user.createdAt}`).digest('hex');

    const existedToken = await redisClient.get(key)

    if (existedToken) {
        await redisClient.del(key);
    }

    const token = await json.sign({id: user.id}, process.env.TOKEN_SECRET, {
        expiresIn: process.env.TOKEN_TTL
    });

    await redisClient.setEx(key, process.env.REDIS_EXPIRATION_TIME, token);

    const {email} = user;

    return res
        // .cookie('jwt', token, {
        //     httpOnly: true,
        //     secure: process.env.NODE_ENV === 'prod'
        // })
        .status(200)
        .json({
            status: 'success',
            data: {
                email,
                token
            }
        });
})