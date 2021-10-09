'use strict';

const express = require(`express`);
const request = require(`supertest`);
const Sequelize = require(`sequelize`);

const initDb = require(`../lib/init-db`);
const article = require(`./article`);
const ArticleService = require(`../data-service/article`);
const CommentService = require(`../data-service/comment`);
const {HttpCode} = require(`../../constants`);

const mockCategories = [
  `За жизнь`,
  `Разное`,
  `IT`,
  `Кино`,
  `Музыка`,
  `Железо`,
  `Деревья`,
  `Без рамки`,
  `Программирование`,
];

const mockArticles = [
  {
    "title": `Лучшие рок-музыканты 20-века`,
    "announce": `Он написал больше 30 хитов.`,
    "fullText": `Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Как начать действовать? Для начала просто соберитесь. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Простые ежедневные упражнения помогут достичь успеха. Он написал больше 30 хитов. Первая большая ёлка была установлена только в 1938 году. Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Это один из лучших рок-музыкантов. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Ёлки — это не просто красивое дерево. Это прочная древесина. Достичь успеха помогут ежедневные повторения. Золотое сечение — соотношение двух величин, гармоническая пропорция. Собрать камни бесконечности легко, если вы прирожденный герой. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Программировать не настолько сложно, как об этом говорят.`,
    "categories": [
      `За жизнь`,
      `Разное`,
      `IT`,
      `Кино`,
      `Музыка`,
      `Железо`
    ],
    "comments": [
      {
        "text": `Мне не нравится ваш стиль. Ощущение, что вы меня поучаете. Согласен с автором! Давно не пользуюсь стационарными компьютерами. Ноутбуки победили. Плюсую, но слишком много буквы! Хочу такую же футболку :-) Планируете записать видосик на эту тему? Мне кажется или я уже читал это где-то? Совсем немного... Это где ж такие красоты?`
      },
      {
        "text": `Согласен с автором! Это где ж такие красоты? Мне не нравится ваш стиль. Ощущение, что вы меня поучаете. Давно не пользуюсь стационарными компьютерами. Ноутбуки победили. Планируете записать видосик на эту тему? Плюсую, но слишком много буквы! Совсем немного... Хочу такую же футболку :-) Мне кажется или я уже читал это где-то?`
      },
      {
        "text": `Планируете записать видосик на эту тему? Согласен с автором!`
      }
    ]
  },
  {
    "title": `Рок — это протест`,
    "announce": `Золотое сечение — соотношение двух величин, гармоническая пропорция. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем.`,
    "fullText": `Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры. Простые ежедневные упражнения помогут достичь успеха. Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Ёлки — это не просто красивое дерево. Это прочная древесина. Собрать камни бесконечности легко, если вы прирожденный герой. Первая большая ёлка была установлена только в 1938 году. Достичь успеха помогут ежедневные повторения. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Он написал больше 30 хитов.`,
    "categories": [
      `Деревья`,
      `Разное`,
      `За жизнь`,
      `Кино`,
      `IT`
    ],
    "comments": [
      {
        "text": `Это где ж такие красоты? Планируете записать видосик на эту тему?`
      },
      {
        "text": `Хочу такую же футболку :-) Совсем немного... Согласен с автором! Плюсую, но слишком много буквы! Мне кажется или я уже читал это где-то? Это где ж такие красоты? Мне не нравится ваш стиль. Ощущение, что вы меня поучаете.`
      }
    ]
  },
  {
    "title": `Лучшие рок-музыканты 20-века`,
    "announce": `Как начать действовать? Для начала просто соберитесь.`,
    "fullText": `Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Это один из лучших рок-музыкантов. Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Как начать действовать? Для начала просто соберитесь. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много.`,
    "categories": [
      `Программирование`,
      `Музыка`,
      `За жизнь`
    ],
    "comments": [
      {
        "text": `Совсем немного...`
      },
      {
        "text": `Давно не пользуюсь стационарными компьютерами. Ноутбуки победили. Мне кажется или я уже читал это где-то? Планируете записать видосик на эту тему? Мне не нравится ваш стиль. Ощущение, что вы меня поучаете. Хочу такую же футболку :-) Совсем немного... Плюсую, но слишком много буквы! Согласен с автором! Это где ж такие красоты?`
      }
    ]
  },
  {
    "title": `Лучшие рок-музыканты 20-века`,
    "announce": `Собрать камни бесконечности легко, если вы прирожденный герой. Он написал больше 30 хитов. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Ёлки — это не просто красивое дерево. Это прочная древесина.`,
    "fullText": `Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Достичь успеха помогут ежедневные повторения. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много.`,
    "categories": [
      `За жизнь`,
      `IT`,
      `Кино`
    ],
    "comments": [
      {
        "text": `Мне не нравится ваш стиль. Ощущение, что вы меня поучаете. Совсем немного... Давно не пользуюсь стационарными компьютерами. Ноутбуки победили. Это где ж такие красоты? Плюсую, но слишком много буквы! Планируете записать видосик на эту тему? Мне кажется или я уже читал это где-то? Хочу такую же футболку :-)`
      }
    ]
  },
  {
    "title": `Обзор новейшего смартфона`,
    "announce": `Он написал больше 30 хитов. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Первая большая ёлка была установлена только в 1938 году.`,
    "fullText": `Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Ёлки — это не просто красивое дерево. Это прочная древесина. Программировать не настолько сложно, как об этом говорят. Золотое сечение — соотношение двух величин, гармоническая пропорция. Это один из лучших рок-музыкантов. Из под его пера вышло 8 платиновых альбомов. Как начать действовать? Для начала просто соберитесь. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Простые ежедневные упражнения помогут достичь успеха. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много.`,
    "categories": [
      `Кино`,
      `Железо`,
      `IT`
    ],
    "comments": [
      {
        "text": `Хочу такую же футболку :-) Мне не нравится ваш стиль. Ощущение, что вы меня поучаете. Мне кажется или я уже читал это где-то? Совсем немного... Согласен с автором!`
      },
      {
        "text": `Мне не нравится ваш стиль. Ощущение, что вы меня поучаете. Согласен с автором! Совсем немного... Плюсую, но слишком много буквы! Это где ж такие красоты?`
      }
    ]
  }
];

const createAPI = async () => {
  const mockDB = new Sequelize(`sqlite::memory:`, {logging: false});
  await initDb(mockDB, {articles: mockArticles, categories: mockCategories});

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
    title: `Валидный заголовок`,
    announce: `Валидный анонс`,
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
});

describe(`API changes existent article`, () => {
  const newArticle = {
    title: `Валидный заголовок`,
    announce: `Валидный анонс`,
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
      .expect((res) => expect(res.body.title).toBe(`Валидный заголовок`));
  });
});

test(`API returns status code 404 when trying to change non-existent article`, async () => {
  const newArticle = {
    title: `Валидный заголовок`,
    announce: `Валидный анонс`,
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
    expect(response.body[2].text).toBe(`Планируете записать видосик на эту тему? Согласен с автором!`)
  });
});

describe(`API creates a comment if data is valid`, () => {
  const newComment = {
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

