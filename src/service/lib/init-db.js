'use strict';

const defineModels = require(`../models/models`);
const Alias = require(`../models/alias`);

module.exports = async (sequelize, {articles, categories}) => {
  const {Article, Category} = defineModels(sequelize);
  await sequelize.sync({force: true});

  const categoryModel = await Category.bulkCreate(
      categories.map((item) => ({name: item}))
  );

  const categoryIdByName = categoryModel.reduce((acc, item) => ({
    ...acc,
    [item.name]: item.id,
  }), {});

  const articlePromises = articles.map(async (article) => {
    const articleModel = await Article.create(article, {include: [Alias.COMMENTS]});

    await articleModel.addCategories(
        article.category.map((name) => categoryIdByName[name])
    );
  });

  await Promise.all(articlePromises);
};
