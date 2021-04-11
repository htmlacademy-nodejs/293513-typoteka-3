'use strict';

const {Model, DataTypes} = require(`sequelize`);

class User extends Model {}

const define = (sequelize) => User.init({
  'first_name': {
    type: DataTypes.STRING,
    allowNull: false,
  },
  'last_name': {
    type: DataTypes.STRING,
    allowNull: false,
  },
  'password_hash': {
    type: DataTypes.STRING,
    allowNull: false,
  },
  'avatar': {
    type: DataTypes.STRING,
    allowNull: false,
  },
  'email': {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
}, {
  sequelize,
  modelName: `User`,
  tableName: 'users',
});

module.exports = define;
