const express = require('express');
const dotenv = require('dotenv').config();
const postRouter = require('./routes/posts');
const categoryRouter = require('./routes/categories');
const logger = require('./util/logger');
const sequelize = require('./util/database')

const app = express();

app.use(express.json());

app.use(logger);

app.use('/api/v1', postRouter, categoryRouter);

sequelize.sync()
    .then(result => {
        // console.log(result)
        app.listen(process.env.PORT, () => {
            console.log(`Server is running at ${process.env.PORT}`);
        });
    })
    .catch(err => {
        console.log(err)
    });