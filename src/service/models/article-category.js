'use strict';

const {Model} = require(`sequelize`);

class ArticleCategory extends Model {}

const define = (sequelize) => ArticleCategory.init({}, {
  sequelize,
  modelName: `ArticleCategory`,
  tableName: `articleCategories`,
});

module.exports = define;
