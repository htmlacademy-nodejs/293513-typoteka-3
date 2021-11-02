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
  const comments = await api.getComments(null, true);
  res.render(`comments`, {comments, user});
}));

module.exports = myRouter;
