'use strict';

const {Router} = require(`express`);
const article = require(`./article`);
const category = require(`./category`);
const search = require(`./search`);
const user = require(`./user`);
const {
  ArticleService,
  CommentService,
  CategoryService,
  SearchService,
  UserService,
} = require(`../data-service`);
const sequelize = require(`../lib/sequelize`);
const defineModels = require(`../models/models`);

module.exports = () => {
  const app = new Router();

  defineModels(sequelize);

  article(app, new ArticleService(sequelize), new CommentService(sequelize));
  category(app, new CategoryService(sequelize));
  search(app, new SearchService(sequelize));
  user(app, new UserService(sequelize));

  return app;
};
