const express = require('express');
const dotenv = require('dotenv').config();
const postRouter = require('./routes/posts');

const app = express();

app.use('/api/v1', postRouter);

app.listen(process.env.PORT, () => {
    console.log(`Server is running at ${process.env.PORT}`);
});