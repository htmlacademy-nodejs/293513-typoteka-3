'use strict';

const {Router} = require(`express`);
const api = require(`../api`).getAPI();
const asyncMiddleware = require(`../middlewares/async-middleware`);

const mainRouter = new Router();

mainRouter.get(`/`, asyncMiddleware(async (req, res) => {
  const articles = await api.getArticles();
  res.render(`main`, {articles});
}));

mainRouter.get(`/register`, (req, res) => res.render(`sign-up`));
mainRouter.get(`/login`, (req, res) => res.render(`login`));

mainRouter.get(`/search`, async (req, res) => {
  try {
    const {search} = req.query;
    const results = await api.search(search.toLowerCase());
    res.render(`search`, {results, search: search.toLowerCase()});
  } catch (err) {
    res.render(`search`, {results: [], search: req.query.search});
  }
});

mainRouter.get(`/categories`, (req, res) => res.render(`all-categories`));

module.exports = mainRouter;
