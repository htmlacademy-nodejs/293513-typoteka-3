'use strict';

const {Router} = require(`express`);
const api = require(`../api`).getAPI();
const asyncMiddleware = require(`../middlewares/async-middleware`);
const auth = require(`../middlewares/auth`);

const myRouter = new Router();

myRouter.get(`/`, auth, asyncMiddleware(async (req, res) => {
  const {user} = req.session;
  const articles = await api.getArticles();
  res.render(`my`, {articles, user});
}));

myRouter.get(`/comments`, auth, asyncMiddleware(async (req, res) => {
  const {user} = req.session;
  const articles = await api.getArticles({comments: true});
  res.render(`comments`, {articles: articles.slice(0, 3), user});
}));

module.exports = myRouter;
