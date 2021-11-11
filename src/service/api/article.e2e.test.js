'use strict';

const express = require(`express`);
const request = require(`supertest`);
const Sequelize = require(`sequelize`);

const initDb = require(`../lib/init-db`);
const article = require(`./article`);
const ArticleService = require(`../data-service/article`);
const CommentService = require(`../data-service/comment`);
const {HttpCode} = require(`../../constants`);
const {mockArticles, mockCategories, getMockUsers} = require(`../mockData`);

const createAPI = async () => {
  const mockDB = new Sequelize(`sqlite::memory:`, {logging: false});
  await initDb(mockDB, {
    articles: mockArticles,
    categories: mockCategories,
    users: await getMockUsers(),
  });

  const app = express();
  app.use(express.json());

  article(app, new ArticleService(mockDB), new CommentService(mockDB));

  return app;
};

describe(`API returns a list of all articles`, () => {
  let response;

  beforeAll(async () => {
    const app = await createAPI();
    response = await request(app).get(`/articles`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Returns a list of 5 articles`, () => expect(response.body.length).toBe(5));
});

describe(`API returns an article with given id`, () => {
  let response;

  beforeAll(async () => {
    const app = await createAPI();
    response = await request(app).get(`/articles/1`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Article's title is "Лучшие рок-музыканты 20-века"`, () => {
    expect(response.body.title).toBe(`Лучшие рок-музыканты 20-века`);
  });
});

describe(`API creates an article if data is valid`, () => {
  const newArticle = {
    userId: 1,
    title: `Валидный заголовок очень валидный.`,
    announce: `Валидный анонс очень валидный.`,
    categories: [1, 2],
  };

  let app;
  let response;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app).post(`/articles`).send(newArticle);
  });

  test(`Status code 201`, () => expect(response.statusCode).toBe(HttpCode.CREATED));
  test(`Articles count is changed`, async () => {
    await request(app).get(`/articles`).expect((res) => expect(res.body.length).toBe(6));
  });
});

describe(`API refuses to create an article if data is invalid`, () => {
  const newArticle = {
    title: `Валидный заголовок`,
    announce: `Валидный анонс`,
    categories: [1],
  };

  let app;

  beforeAll(async () => {
    app = await createAPI();
  });

  test(`Without any required property response code is 400`, async () => {
    for (const key of Object.keys(newArticle)) {
      const badArticle = {...newArticle};
      delete badArticle[key];

      await request(app).post(`/articles`).send(badArticle).expect(HttpCode.BAD_REQUEST);
    }
  });

  test(`When field type is wrong response code is 400`, async () => {
    const badArticles = [
      {...newArticle, title: true},
      {...newArticle, announce: 12345},
      {...newArticle, categories: `Котики`}
    ];

    for (const badArticle of badArticles) {
      await request(app)
        .post(`/articles`)
        .send(badArticle)
        .expect(HttpCode.BAD_REQUEST);
    }
  });

  test(`When field value is wrong response code is 400`, async () => {
    const badArticles = [
      {...newArticle, title: `Short title`},
      {...newArticle, announce: `Short announce`},
      {...newArticle, categories: []}
    ];

    for (const badArticle of badArticles) {
      await request(app)
        .post(`/articles`)
        .send(badArticle)
        .expect(HttpCode.BAD_REQUEST);
    }
  });
});

describe(`API changes existent article`, () => {
  const newArticle = {
    userId: 1,
    title: `Валидный заголовок очень валидный.`,
    announce: `Валидный анонс очень валидный.`,
    categories: [2],
  };

  let app;
  let response;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app).put(`/articles/1`).send(newArticle);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Article is really changed`, async () => {
    await request(app).get(`/articles/1`)
      .expect((res) => expect(res.body.title).toBe(`Валидный заголовок очень валидный.`));
  });
});

test(`API returns status code 404 when trying to change non-existent article`, async () => {
  const newArticle = {
    userId: 1,
    title: `Валидный заголовок очень валидный.`,
    announce: `Валидный анонс очень валидный.`,
    categories: [1],
  };

  const app = await createAPI();

  await request(app).put(`/articles/100`).send(newArticle).expect(HttpCode.NOT_FOUND);
});

test(`API returns status code 404 when trying to change an article with invalid data`, async () => {
  const invalidArticle = {
    title: `Валидный заголовок`,
    category: [1],
  };

  const app = await createAPI();

  await request(app).put(`/articles/1`).send(invalidArticle).expect(HttpCode.BAD_REQUEST);
});

describe(`API correctly deletes an article`, () => {
  let app;
  let response;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app).delete(`/articles/1`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Articles count is 4 now`, async () => {
    await request(app).get(`/articles`).expect((res) => expect(res.body.length).toBe(4));
  });
});

test(`API returns to delete non-existent article`, async () => {
  const app = await createAPI();
  await request(app).delete(`/articles/100`).expect(HttpCode.NOT_FOUND);
});

describe(`API returns a list of comments to given article`, () => {
  let response;

  beforeAll(async () => {
    const app = await createAPI();
    response = await request(app).get(`/articles/1/comments`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Returns list of 3 comments`, () => expect(response.body.length).toBe(3));
  test(`Third comment's text is "Планируете записать видосик на эту тему? Согласен с автором!"`, () => {
    expect(response.body[2].text).toBe(`Планируете записать видосик на эту тему? Согласен с автором!`);
  });
});

describe(`API creates a comment if data is valid`, () => {
  const newComment = {
    userId: 1,
    text: `Валидному комментарию достаточно этого поля`
  };

  let app;
  let response;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app).post(`/articles/1/comments`).send(newComment);
  });

  test(`Status code 201`, () => expect(response.statusCode).toBe(HttpCode.CREATED));
  test(`Comments count is changed`, async () => {
    await request(app).get(`/articles/1/comments`)
      .expect((res) => expect(res.body.length).toBe(4));
  });
});

test(`API refuses to create a comment to non-existent article and return status code 404`, async () => {
  const app = await createAPI();

  await request(app).post(`/articles/100/comments`).send({text: `comment`})
    .expect(HttpCode.NOT_FOUND);
});

test(`API refuses to create a comment when data is invalid, and returns status code 400`, async () => {
  const app = await createAPI();
  await request(app).post(`/articles/1/comments`).send({})
    .expect(HttpCode.BAD_REQUEST);
});

describe(`API correctly deletes a comment`, () => {
  let app;
  let response;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app).delete(`/articles/1/comments/2`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Comments count is 2 now`, async () => {
    await request(app).get(`/articles/1/comments`)
      .expect((res) => expect(res.body.length).toBe(2));
  });
});

test(`API refuses to delete non-existent comment`, async () => {
  const app = await createAPI();
  await request(app).delete(`/articles/1/comments/100`).expect(HttpCode.NOT_FOUND);
});

test(`API refuses to delete a comment to non-existent offer`, async () => {
  const app = await createAPI();
  await request(app).delete(`/articles/100/comments/1`).expect(HttpCode.NOT_FOUND);
});

