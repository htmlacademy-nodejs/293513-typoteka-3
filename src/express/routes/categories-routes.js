'use strict';

const {Router} = require(`express`);
const csrf = require(`csurf`);
const api = require(`../api`).getAPI();
const auth = require(`../middlewares/auth`);
const asyncMiddleware = require(`../middlewares/async-middleware`);
const {prepareErrors} = require(`../../utils`);

const csrfProtection = csrf();
const categoryRouter = new Router();

categoryRouter.get(`/`, [auth, csrfProtection], asyncMiddleware(async (req, res) => {
  const {user} = req.session;
  const categories = await api.getCategories();

  res.render(`all-categories`, {
    user,
    categories,
    csrfToken: req.csrfToken(),
  });
}));

categoryRouter.post(`/add`, [auth, csrfProtection], async (req, res) => {
  const {user} = req.session;
  const {category} = req.body;

  const categoryData = {
    name: category,
  };

  try {
    await api.createCategory(categoryData);
    res.redirect(`/categories`);
  } catch (errors) {
    const validationMessages = prepareErrors(errors);
    const categories = await api.getCategories();

    const meta = {
      category: categoryData,
      errors: validationMessages,
    };

    req.session.meta = meta;
    req.session.save(() => {
      res.render(`all-categories`, {
        user,
        categories,
        csrfToken: req.csrfToken(),
        meta,
      });
    });
  }
});

categoryRouter.post(`/edit/:categoryId`, [auth, csrfProtection], async (req, res) => {
  const {user} = req.session;
  const {categoryId} = req.params;
  const {category} = req.body;

  const categoryData = {
    name: category,
  };

  try {
    await api.editCategory(categoryId, categoryData);
    res.redirect(`/categories`);
  } catch (errors) {
    const validationMessages = prepareErrors(errors);
    const categories = await api.getCategories();

    const meta = {
      category: categoryData,
      errors: validationMessages,
    };

    req.session.meta = meta;
    req.session.save(() => {
      res.render(`all-categories`, {
        user,
        categories,
        csrfToken: req.csrfToken(),
        meta,
      });
    });
  }
});

categoryRouter.get(`/delete/:categoryId`, [auth, csrfProtection], async (req, res) => {
  const {user} = req.session;
  const {categoryId} = req.params;

  try {
    await api.deleteCategory(categoryId);
    res.redirect(`/categories`);
  } catch (errors) {
    const validationMessages = prepareErrors(errors);
    const categories = await api.getCategories();

    const meta = {
      errors: validationMessages,
    };

    req.session.meta = meta;
    req.session.save(() => {
      res.render(`all-categories`, {
        user,
        categories,
        csrfToken: req.csrfToken(),
        meta,
      });
    });
  }
});

module.exports = categoryRouter;
