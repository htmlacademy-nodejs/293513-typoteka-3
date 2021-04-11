'use strict';

const {Model, DataTypes} = require(`sequelize`);

class Article extends Model {}

const define = (sequelize) => Article.init({
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  picture: {
    type: DataTypes.STRING,
  },
  announce: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  fullText: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
}, {
  sequelize,
  modelName: `Article`,
  tableName: `articles`,
});

module.exports = define;
