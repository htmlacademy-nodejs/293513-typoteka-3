'use strict';

const express = require(`express`);
const request = require(`supertest`);
const Sequelize = require(`sequelize`);

const initDb = require(`../lib/init-db`);
const category = require(`./category`);
const CategoryService = require(`../data-service/category`);
const {HttpCode} = require(`../../constants`);
const {mockCategories, mockArticles, getMockUsers} = require(`../mockData`);

const mockDB = new Sequelize(`sqlite::memory:`, {logging: false});

const app = express();
app.use(express.json());

beforeAll(async () => {
  await initDb(mockDB, {
    articles: mockArticles,
    categories: mockCategories,
    users: await getMockUsers(),
  });

  category(app, new CategoryService(mockDB));
});

describe(`API returns category list`, () => {
  let response;

  beforeAll(async () => {
    response = await request(app).get(`/categories`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Returns list of 9 categories`, () => expect(response.body.length).toBe(9));
  test(`Category names are "За жизнь", "Разное", "IT", "Кино", "Музыка", "Железо", "Деревья", "Без рамки", "Программирование"`, () => {
    expect(response.body.map((it) => it.name)).toEqual([
      `За жизнь`,
      `Разное`,
      `IT`,
      `Кино`,
      `Музыка`,
      `Железо`,
      `Деревья`,
      `Без рамки`,
      `Программирование`,
    ]);
  });
});
