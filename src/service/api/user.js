'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../constants`);
const userValidator = require(`../middlewares/user-validator`);
const passwordUtils = require(`../lib/password`);

module.exports = (app, userService) => {
  const route = new Router();

  app.use(`/user`, route);

  route.post(`/`, userValidator(userService), async (req, res) => {
    const data = req.body;

    data.passwordHash = await passwordUtils.hash(data.password);
    const result = await userService.create(data);
    delete result.passwordHash;

    res.status(HttpCode.CREATED).json(result);
  });
};
