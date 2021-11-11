'use strict';

const express = require(`express`);
const request = require(`supertest`);
const Sequelize = require(`sequelize`);

const initDb = require(`../lib/init-db`);
const search = require(`./search`);
const SearchService = require(`../data-service/search`);
const {HttpCode} = require(`../../constants`);
const {mockArticles, mockCategories, getMockUsers} = require(`../mockData`);

const mockDB = new Sequelize(`sqlite::memory:`, {logging: false});

const app = express();
app.use(express.json());

beforeAll(async () => {
  await initDb(mockDB, {
    articles: mockArticles,
    categories: mockCategories,
    users: await getMockUsers(),
  });
  search(app, new SearchService(mockDB));
});

describe(`API returns articles based on search query`, () => {
  let response;

  beforeAll(async () => {
    response = await request(app)
      .get(`/search`)
      .query({
        query: `Рок`.toLowerCase(),
      });
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Four article found`, () => expect(response.body.length).toBe(3));
  test(`Article has correct title "Лучшие рок-музыканты 20-века"`, () => {
    expect(response.body[0].title).toBe(`Лучшие рок-музыканты 20-века`);
  });
});

test(`API returns code 404 if nothing is found`, async () => {
  await request(app).get(`/search`).query({
    query: `Продам свою душу`,
  }).expect(HttpCode.NOT_FOUND);
});

test(`API returns code 400 when query string is absent`, async () => {
  await request(app).get(`/search`).expect(HttpCode.BAD_REQUEST);
});
