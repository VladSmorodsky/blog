const express = require('express');
const dotenv = require('dotenv').config();
const postRouter = require('./routes/posts');
const categoryRouter = require('./routes/categories');
const userRouter = require('./routes/users');
const authRouter = require('./routes/auth');
const logger = require('./util/logger');
const sequelize = require('./util/database')
const AppError = require("./errors/AppError");
const {ValidationError} = require("sequelize");
const {TokenExpiredError, JsonWebTokenError} = require("jsonwebtoken");
const cookieParser = require('cookie-parser');

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(logger);

app.use('/api/v1', postRouter, categoryRouter, userRouter, authRouter);

app.use((err, req, res, next) => {
    if (process.env.NODE_ENV === 'dev') {
        console.error(err);
    }

    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            status: "fail",
            message: err.message
        });
    }

    if (err instanceof ValidationError) {
        return res.status(400).json({
            status: 'fail',
            message: `Field ${err.errors[0].path} cannot be ${err.errors[0].validatorName}`
        });
    }

    if (err instanceof JsonWebTokenError) {
        return res.status(401).json({
            status: 'error',
            mesage: 'Invalid token. Please login to the system'
        });
    }

    if (err instanceof TokenExpiredError) {
        return res.status(401).json({
            status: 'error',
            mesage: 'Invalid token. Please login to the system'
        });
    }

    res.status(500).json({
        status: 'error',
        message: 'Smth went wrong'
    });
});

sequelize.sync()
    .then(result => {
        app.listen(process.env.PORT, () => {
            console.log(`Server is running at ${process.env.PORT}`);
        });
    })
    .catch(err => {
        console.log(err)
    });