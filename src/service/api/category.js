'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../constants`);
const routeParamsValidator = require(`../middlewares/route-params-validator`);
const categoryValidator = require(`../middlewares/category-validator`);

module.exports = (app, service) => {
  const route = new Router();

  app.use(`/categories`, route);

  route.get(`/`, async (req, res) => {
    const {count} = req.query;

    const categories = await service.findAll(count);

    res.status(HttpCode.OK).json(categories);
  });

  route.get(`/:categoryId`, routeParamsValidator, async (req, res) => {
    const {categoryId} = req.params;

    const category = await service.findOne(categoryId);

    return res.status(HttpCode.OK).json(category);
  });

  route.post(`/`, categoryValidator, async (req, res) => {
    const category = await service.create(req.body);
    res.status(HttpCode.CREATED).json(category);
  });

  route.put(`/:categoryId`, [routeParamsValidator, categoryValidator], async (req, res) => {
    const {categoryId} = req.params;

    const updated = await service.update(categoryId, req.body);

    if (!updated) {
      return res.status(HttpCode.NOT_FOUND).send(`Not found with ${categoryId}`);
    }

    return res.status(HttpCode.OK).json(`Updated`);
  });

  route.delete(`/:categoryId`, routeParamsValidator, async (req, res) => {
    const {categoryId} = req.params;

    const category = await service.remove(categoryId);

    if (!category) {
      return res.status(HttpCode.NOT_FOUND).send(`Not found with ${categoryId}`);
    }

    return res.status(HttpCode.OK).json(category);
  });
};
