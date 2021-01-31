'use strict';

const {Router} = require(`express`);
const article = require(`./article`);
const category = require(`./category`);
const {ArticleService, CommentService, CategoryService} = require(`../data-service`);

module.exports = (mockData) => {
  const app = new Router();

  article(app, new ArticleService(mockData), new CommentService());
  category(app, new CategoryService(mockData));

  return app;
};
