'use strict';

const {Router} = require(`express`);
const article = require(`./article`);
const category = require(`./category`);
const search = require(`./search`);
const {ArticleService, CommentService, CategoryService, SearchService} = require(`../data-service`);

module.exports = (mockData) => {
  const app = new Router();

  article(app, new ArticleService(mockData), new CommentService());
  category(app, new CategoryService(mockData));
  search(app, new SearchService(mockData));

  return app;
};
