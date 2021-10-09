'use strict';

const {Router} = require(`express`);
const api = require(`../api`).getAPI();
const asyncMiddleware = require(`../middlewares/async-middleware`);
const {ARTICLE_PER_PAGE} = require(`../../constants`);

const mainRouter = new Router();

mainRouter.get(`/`, asyncMiddleware(async (req, res) => {
  const {page = 1} = req.query;
  const limit = ARTICLE_PER_PAGE;
  const offset = (Number(page) - 1) * ARTICLE_PER_PAGE;

  const [
    {count, articles},
    categories
  ] = await Promise.all([
    api.getArticles({limit, offset}),
    api.getCategories(true),
  ]);

  const totalPage = Math.ceil(count / ARTICLE_PER_PAGE);

  res.render(`main`, {articles, page: Number(page), totalPage, categories});
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
