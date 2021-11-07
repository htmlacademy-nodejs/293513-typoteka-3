'use strict';

const {Router} = require(`express`);
const api = require(`../api`).getAPI();
const asyncMiddleware = require(`../middlewares/async-middleware`);
const {ARTICLE_PER_PAGE} = require(`../../constants`);
const upload = require(`../middlewares/upload`);
const {prepareErrors} = require(`../../utils`);

const mainRouter = new Router();

mainRouter.get(`/`, asyncMiddleware(async (req, res) => {
  const {user} = req.session;
  const {page = 1} = req.query;
  const limit = ARTICLE_PER_PAGE;
  const offset = (Number(page) - 1) * ARTICLE_PER_PAGE;

  const [{count, articles}, categories, comments, popular] = await Promise.all([
    api.getArticles({offset, limit, comments: true}),
    api.getCategories(true),
    api.getComments(4),
    api.getPopularArticles(4),
  ]);

  const totalPages = Math.ceil(count / ARTICLE_PER_PAGE);

  res.render(`main`, {
    articles,
    page: Number(page),
    totalPages,
    categories,
    comments,
    popular,
    user,
  });
}));

mainRouter.get(`/register`, (req, res) => {
  const {user} = req.session;
  res.render(`sign-up`, {user});
});

mainRouter.post(`/register`, upload.single(`upload`), async (req, res) => {
  const {body, file} = req;

  const userData = {
    email: body.email,
    name: body.name,
    surname: body.surname,
    password: body.password,
    passwordRepeated: body[`repeat-password`],
    avatar: file ? file.filename : ``,
  };

  try {
    await api.createUser(userData);
    res.redirect(`/login`);
  } catch (errors) {
    const validationMessages = prepareErrors(errors);

    const meta = {
      user: {
        email: userData.email,
        name: userData.name,
        surname: userData.surname,
        avatar: userData.avatar,
      },
      errors: validationMessages,
    }

    req.session.meta = meta;
    req.session.save(() => {
      res.render(`sign-up`, {meta});
    });
  }
});

mainRouter.get(`/login`, (req, res) => {
  const {user} = req.session;
  res.render(`login`, {user});
});

mainRouter.post(`/login`, async (req, res) => {
  const {email, password} = req.body;

  try {
    const user = await api.auth(email, password);

    req.session.user = user;
    req.session.user.isAdmin = user.id === 1;

    req.session.save(() => {
      res.redirect(`/`);
    });
  } catch (errors) {
    const validationMessages = prepareErrors(errors);
    const meta = {
      email,
      errors: validationMessages,
    };

    req.session.meta = meta;

    req.session.save(() => {
      res.render(`login`, {meta})
    });
  }
});

mainRouter.get(`/logout`, (req, res) => {
  delete req.session.user;

  req.session.save(() => {
    res.redirect(`/login`);
  });
});

mainRouter.get(`/search`, async (req, res) => {
  const {user} = req.session;
  const {search} = req.query;

  try {
    const results = await api.search(search);
    res.render(`search`, {results, search, user});
  } catch (err) {
    res.render(`search`, {results: [], search, user});
  }
});

module.exports = mainRouter;
