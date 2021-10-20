'use strict';

const defineArticle = require(`./article`);
const defineArticleCategory = require(`./article-category`);
const defineComment = require(`./comment`);
const defineCategory = require(`./category`);
const defineUser = require(`./user`);
const Alias = require(`./alias`);

const define = (sequelize) => {
  const Article = defineArticle(sequelize);
  const ArticleCategory = defineArticleCategory(sequelize);
  const Comment = defineComment(sequelize);
  const Category = defineCategory(sequelize);
  const User = defineUser(sequelize);

  Article.hasMany(Comment, {as: Alias.COMMENTS, foreignKey: `articleId`, onDelete: `cascade`});
  Comment.belongsTo(Article, {foreignKey: `articleId`});

  Article.belongsToMany(Category, {through: ArticleCategory, as: Alias.CATEGORIES});
  Category.belongsToMany(Article, {through: ArticleCategory, as: Alias.ARTICLES});
  Category.hasMany(ArticleCategory, {as: Alias.ARTICLE_CATEGORIES});

  User.hasMany(Article, {as: Alias.ARTICLES, foreignKey: `userId`});
  Article.belongsTo(User, {as: Alias.USERS, foreignKey: `userId`});

  User.hasMany(Comment, {as: Alias.COMMENTS, foreignKey: `userId`});
  Comment.belongsTo(User, {as: Alias.USERS, foreignKey: `userId`});

  return {
    Article,
    ArticleCategory,
    Comment,
    Category,
    User,
  };
};

module.exports = define;
