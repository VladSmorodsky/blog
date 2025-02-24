const sequelize = require('../util/database');
const Category = require('./category');
const User = require('./user');
const Sequelize = require("sequelize");

const Post = sequelize.define('post', {
    'id': {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    'title': {
        type: Sequelize.STRING,
        allowNull: false
    },
    'imageCover': {
        type: Sequelize.STRING
    },
    'content': {
        type: Sequelize.TEXT,
        allowNull: false
    }
});

Post.belongsTo(Category);
Category.hasMany(Post);

Post.belongsTo(User);
User.hasMany(Post);


module.exports = Post;

