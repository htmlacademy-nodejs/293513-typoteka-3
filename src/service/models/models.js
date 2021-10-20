'use strict';

const defineArticle = require(`./article`);
const defineArticleCategory = require(`./article-category`);
const defineComment = require(`./comment`);
const defineCategory = require(`./category`);
const defineUser = require(`./user`);

const define = (sequelize) => {
  const Article = defineArticle(sequelize);
  const ArticleCategory = defineArticleCategory(sequelize);
  const Comment = defineComment(sequelize);
  const Category = defineCategory(sequelize);
  const User = defineUser(sequelize);

  const models = {
    Article,
    ArticleCategory,
    Comment,
    Category,
    User,
  };

  Article.associate(models);
  Comment.associate(models);
  Category.associate(models);
  User.associate(models);

  return models;
};

module.exports = define;
