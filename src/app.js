const express = require('express');
const dotenv = require('dotenv').config();

const app = express();

app.get("/test", (req, res, next) => {
    res.send("hi");
});

app.listen(process.env.PORT, () => {
    console.log(`Server is running at ${process.env.PORT}`);
});