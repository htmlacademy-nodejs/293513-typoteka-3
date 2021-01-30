'use strict';

const {Router} = require(`express`);
const article = require(`./article`);
const {ArticleService, CommentService} = require(`../data-service`);

module.exports = (mockData) => {
  const app = new Router();

  article(app, new ArticleService(mockData), new CommentService());

  return app;
};
