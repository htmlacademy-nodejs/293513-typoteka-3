'use strict';

const defineModels = require(`../models/models`);
const Alias = require(`../models/alias`);

module.exports = async (sequelize, {articles, categories, users}) => {
  const {Article, Category, User} = defineModels(sequelize);
  await sequelize.sync({force: true});

  const categoryModel = await Category.bulkCreate(
      categories.map((item) => ({name: item}))
  );

  const categoryIdByName = categoryModel.reduce((acc, item) => ({
    ...acc,
    [item.name]: item.id,
  }), {});

  const userModel = await User.bulkCreate(users, {
    include: [Alias.ARTICLES, Alias.COMMENTS],
  });

  const userIdByEmail = userModel.reduce((acc, user) => ({
    ...acc,
    [user.email]: user.id,
  }), {});

  articles.forEach((article) => {
    article.userId = userIdByEmail[article.user];
    article.comments.forEach((comment) => {
      comment.userId = userIdByEmail[comment.user];
    });
  });

  const articlePromises = articles.map(async (article) => {
    const articleModel = await Article.create(article, {include: [Alias.COMMENTS]});

    await articleModel.addCategories(
        article.categories.map((name) => categoryIdByName[name])
    );
  });

  await Promise.all(articlePromises);
};
