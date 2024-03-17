const sequelize = require('../util/database');
const Sequelize = require('sequelize');

const User = sequelize.define('user', {
    'id': {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    'firstName': {
        type: Sequelize.STRING,
        allowNull: false
    },
    'lastName': {
        type: Sequelize.STRING,
        allowNull: false
    },
    'email': {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    'password': {
        type: Sequelize.STRING,
        allowNull: false,
    }
});

module.exports = User;