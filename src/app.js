const express = require('express');
const dotenv = require('dotenv').config();
const postRouter = require('./routes/posts');
const categoryRouter = require('./routes/categories');
const logger = require('./util/logger');
const sequelize = require('./util/database')
const AppError = require("./errors/AppError");

const app = express();

app.use(express.json());

app.use(logger);

app.use('/api/v1', postRouter, categoryRouter);

app.use((err, req, res, next) => {
    console.log('[AppError]', err);
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            status: "error",
            message: err.message
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