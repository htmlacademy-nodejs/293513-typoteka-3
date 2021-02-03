'use strict';

const express = require(`express`);
const request = require(`supertest`);

const article = require(`./article`);
const ArticleService = require(`../data-service/article`);
const CommentService = require(`../data-service/comment`);
const {HttpCode} = require(`../../constants`);

const mockData = [
  {
    "id": `bDzXPm`,
    "title": `Самый лучший музыкальный альбом этого года`,
    "announce": `Простые ежедневные упражнения помогут достичь успеха.`,
    "fullText": `Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Он написал больше 30 хитов. Простые ежедневные упражнения помогут достичь успеха. Достичь успеха помогут ежедневные повторения. Ёлки — это не просто красивое дерево. Это прочная древесина. Собрать камни бесконечности легко, если вы прирожденный герой. Это один из лучших рок-музыкантов. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры. Программировать не настолько сложно, как об этом говорят. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Как начать действовать? Для начала просто соберитесь. Золотое сечение — соотношение двух величин, гармоническая пропорция. Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Первая большая ёлка была установлена только в 1938 году.`,
    "createdDate": `2020-12-28T03:02:03.227Z`,
    "category": [
      `Без рамки`,
      `Кино`,
      `Музыка`,
      `Программирование`,
      `Железо`
    ],
    "comments": [
      {
        "id": `OLW7GE`,
        "text": `Согласен с автором! Хочу такую же футболку :-) Совсем немного...`
      }
    ]
  },
  {
    "id": `f1HqPq`,
    "title": `Как начать программировать`,
    "announce": `Он написал больше 30 хитов. Как начать действовать? Для начала просто соберитесь. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике.`,
    "fullText": `Первая большая ёлка была установлена только в 1938 году. Достичь успеха помогут ежедневные повторения. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Из под его пера вышло 8 платиновых альбомов. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Простые ежедневные упражнения помогут достичь успеха. Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Собрать камни бесконечности легко, если вы прирожденный герой. Как начать действовать? Для начала просто соберитесь. Программировать не настолько сложно, как об этом говорят. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Золотое сечение — соотношение двух величин, гармоническая пропорция. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Он написал больше 30 хитов. Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры. Ёлки — это не просто красивое дерево. Это прочная древесина.`,
    "createdDate": `2020-12-18T12:52:03.034Z`,
    "category": [
      `Железо`,
      `За жизнь`,
      `Программирование`,
      `Без рамки`,
      `Деревья`,
      `IT`,
      `Музыка`,
      `Разное`
    ],
    "comments": [
      {
        "id": `7o6ls1`,
        "text": `Мне не нравится ваш стиль. Ощущение, что вы меня поучаете. Совсем немного... Плюсую, но слишком много буквы! Это где ж такие красоты?`
      },
      {
        "id": `u_vPhp`,
        "text": `Совсем немного... Это где ж такие красоты? Согласен с автором! Планируете записать видосик на эту тему? Давно не пользуюсь стационарными компьютерами. Ноутбуки победили. Мне не нравится ваш стиль. Ощущение, что вы меня поучаете.`
      },
      {
        "id": `i7aNI4`,
        "text": `Планируете записать видосик на эту тему? Мне кажется или я уже читал это где-то? Хочу такую же футболку :-) Согласен с автором! Мне не нравится ваш стиль. Ощущение, что вы меня поучаете. Это где ж такие красоты? Плюсую, но слишком много буквы! Совсем немного...`
      }
    ]
  },
  {
    "id": `OHGub4`,
    "title": `Рок — это протест`,
    "announce": `Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры. Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Как начать действовать? Для начала просто соберитесь. Вы можете достичь всего. Стоит только немного постараться и запастись книгами.`,
    "fullText": `Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Простые ежедневные упражнения помогут достичь успеха. Как начать действовать? Для начала просто соберитесь. Он написал больше 30 хитов. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Это один из лучших рок-музыкантов.`,
    "createdDate": `2020-12-26T16:24:21.966Z`,
    "category": [
      `Музыка`,
      `Железо`,
      `IT`,
      `Разное`,
      `Без рамки`,
      `Кино`
    ],
    "comments": [
      {
        "id": `Nf4r9o`,
        "text": `Давно не пользуюсь стационарными компьютерами. Ноутбуки победили. Это где ж такие красоты? Планируете записать видосик на эту тему? Мне кажется или я уже читал это где-то? Хочу такую же футболку :-) Плюсую, но слишком много буквы! Мне не нравится ваш стиль. Ощущение, что вы меня поучаете. Согласен с автором! Совсем немного...`
      },
      {
        "id": `gf5umK`,
        "text": `Это где ж такие красоты? Мне кажется или я уже читал это где-то? Мне не нравится ваш стиль. Ощущение, что вы меня поучаете. Плюсую, но слишком много буквы!`
      },
      {
        "id": `JpUTyp`,
        "text": `Мне не нравится ваш стиль. Ощущение, что вы меня поучаете. Совсем немного... Планируете записать видосик на эту тему? Давно не пользуюсь стационарными компьютерами. Ноутбуки победили. Это где ж такие красоты? Плюсую, но слишком много буквы! Хочу такую же футболку :-) Мне кажется или я уже читал это где-то?`
      },
      {
        "id": `kbbYmS`,
        "text": `Совсем немного... Мне кажется или я уже читал это где-то?`
      }
    ]
  },
  {
    "id": `8-lK8u`,
    "title": `Ёлки. История деревьев`,
    "announce": `Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Собрать камни бесконечности легко, если вы прирожденный герой. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Достичь успеха помогут ежедневные повторения.`,
    "fullText": `Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Первая большая ёлка была установлена только в 1938 году. Из под его пера вышло 8 платиновых альбомов. Ёлки — это не просто красивое дерево. Это прочная древесина. Программировать не настолько сложно, как об этом говорят. Простые ежедневные упражнения помогут достичь успеха. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Достичь успеха помогут ежедневные повторения.`,
    "createdDate": `2021-01-27T02:35:51.010Z`,
    "category": [
      `Железо`,
      `Кино`,
      `Программирование`
    ],
    "comments": [
      {
        "id": `by0fQb`,
        "text": `Мне кажется или я уже читал это где-то? Мне не нравится ваш стиль. Ощущение, что вы меня поучаете. Давно не пользуюсь стационарными компьютерами. Ноутбуки победили. Планируете записать видосик на эту тему? Это где ж такие красоты? Хочу такую же футболку :-) Согласен с автором! Плюсую, но слишком много буквы! Совсем немного...`
      },
      {
        "id": `csTrRl`,
        "text": `Хочу такую же футболку :-) Плюсую, но слишком много буквы! Планируете записать видосик на эту тему? Мне не нравится ваш стиль. Ощущение, что вы меня поучаете. Давно не пользуюсь стационарными компьютерами. Ноутбуки победили.`
      }
    ]
  },
  {
    "id": `sqG-4m`,
    "title": `Борьба с прокрастинацией`,
    "announce": `Простые ежедневные упражнения помогут достичь успеха. Достичь успеха помогут ежедневные повторения.`,
    "fullText": `Собрать камни бесконечности легко, если вы прирожденный герой. Это один из лучших рок-музыкантов. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Первая большая ёлка была установлена только в 1938 году. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Ёлки — это не просто красивое дерево. Это прочная древесина. Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Золотое сечение — соотношение двух величин, гармоническая пропорция. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Программировать не настолько сложно, как об этом говорят. Из под его пера вышло 8 платиновых альбомов. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры. Достичь успеха помогут ежедневные повторения. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле?`,
    "createdDate": `2021-01-25T06:03:20.132Z`,
    "category": [
      `IT`,
      `Железо`,
      `Кино`,
      `Без рамки`
    ],
    "comments": [
      {
        "id": `eQKx6n`,
        "text": `Согласен с автором! Мне не нравится ваш стиль. Ощущение, что вы меня поучаете. Хочу такую же футболку :-)`
      },
      {
        "id": `gl3J15`,
        "text": `Хочу такую же футболку :-) Планируете записать видосик на эту тему? Плюсую, но слишком много буквы! Согласен с автором! Мне кажется или я уже читал это где-то? Это где ж такие красоты?`
      },
      {
        "id": `1tDxBN`,
        "text": `Это где ж такие красоты? Совсем немного... Согласен с автором! Планируете записать видосик на эту тему? Давно не пользуюсь стационарными компьютерами. Ноутбуки победили. Мне не нравится ваш стиль. Ощущение, что вы меня поучаете.`
      }
    ]
  }
];

const createAPI = () => {
  const app = express();
  app.use(express.json());

  const cloneData = JSON.parse(JSON.stringify(mockData));
  article(app, new ArticleService(cloneData), new CommentService());

  return app;
};

describe(`API returns a list of all articles`, () => {
  const app = createAPI();
  let response;

  beforeAll(async () => {
    response = await request(app).get(`/articles`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Returns a list of 5 articles`, () => expect(response.body.length).toBe(5));
  test(`First article's id equals "bDzXPm"`, () => expect(response.body[0].id).toBe(`bDzXPm`));
});

describe(`API returns an article with given id`, () => {
  const app = createAPI();
  let response;

  beforeAll(async () => {
    response = await request(app).get(`/articles/bDzXPm`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Article's title is "Самый лучший музыкальный альбом этого года"`, () => {
    expect(response.body.title).toBe(`Самый лучший музыкальный альбом этого года`);
  });
});

describe(`API creates an article if data is valid`, () => {
  const newArticle = {
    title: `Валидный заголовок`,
    announce: `Валидный анонс`,
    createdDate: `2020-12-28T03:02:03.227Z`,
    category: `Котики`,
  };

  const app = createAPI();
  let response;

  beforeAll(async () => {
    response = await request(app).post(`/articles`).send(newArticle);
  });

  test(`Status code 201`, () => expect(response.statusCode).toBe(HttpCode.CREATED));
  test(`Returns article created`, () => {
    expect(response.body).toEqual(expect.objectContaining(newArticle));
  });
  test(`Articles count is changed`, async () => {
    await request(app).get(`/articles`).expect((res) => expect(res.body.length).toBe(6));
  });
});

describe(`API refuses to create an article if data is invalid`, () => {
  const newArticle = {
    title: `Валидный заголовок`,
    announce: `Валидный анонс`,
    createdDate: `2020-12-28T03:02:03.227Z`,
    category: `Котики`,
  };

  const app = createAPI();

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
    createdDate: `2020-12-28T03:02:03.227Z`,
    category: `Котики`,
  };

  const app = createAPI();
  let response;

  beforeAll(async () => {
    response = await request(app).put(`/articles/bDzXPm`).send(newArticle);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Returns changed article`, () => {
    expect(response.body).toEqual(expect.objectContaining(newArticle));
  });
  test(`Article is really changed`, async () => {
    await request(app).get(`/articles/bDzXPm`)
      .expect((res) => expect(res.body.title).toBe(`Валидный заголовок`));
  });
});

test(`API returns status code 404 when trying to change non-existent article`, async () => {
  const newArticle = {
    title: `Валидный заголовок`,
    announce: `Валидный анонс`,
    createdDate: `2020-12-28T03:02:03.227Z`,
    category: `Котики`,
  };

  const app = createAPI();

  await request(app).put(`/articles/noexists`).send(newArticle).expect(HttpCode.NOT_FOUND);
});

test(`API returns status code 404 when trying to change an article with invalid data`, async () => {
  const invalidArticle = {
    title: `Валидный заголовок`,
    announce: `Валидный анонс`,
    category: `Котики`,
  };

  const app = createAPI();

  await request(app).put(`/articles/bDzXPm`).send(invalidArticle).expect(HttpCode.BAD_REQUEST);
});

describe(`API correctly deletes an article`, () => {
  const app = createAPI();
  let response;

  beforeAll(async () => {
    response = await request(app).delete(`/articles/bDzXPm`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Returns deleted article`, () => expect(response.body.id).toBe(`bDzXPm`));
  test(`Articles count is 4 now`, async () => {
    await request(app).get(`/articles`).expect((res) => expect(res.body.length).toBe(4));
  });
});

test(`API returns to delete non-existent article`, async () => {
  const app = createAPI();
  await request(app).delete(`/articles/noexists`).expect(HttpCode.NOT_FOUND);
});

describe(`API returns a list of comments to given article`, () => {
  const app = createAPI();
  let response;

  beforeAll(async () => {
    response = await request(app).get(`/articles/f1HqPq/comments`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Returns list of 3 comments`, () => expect(response.body.length).toBe(3));
  test(`First comment's id is 7o6ls1`, () => expect(response.body[0].id).toBe(`7o6ls1`));
});

describe(`API creates a comment if data is valid`, () => {
  const newComment = {
    text: `Валидному комментарию достаточно этого поля`
  };

  const app = createAPI();
  let response;

  beforeAll(async () => {
    response = await request(app).post(`/articles/f1HqPq/comments`).send(newComment);
  });

  test(`Status code 201`, () => expect(response.statusCode).toBe(HttpCode.CREATED));
  test(`Returns comment created`, () => {
    expect(response.body).toEqual(expect.objectContaining(newComment));
  });
  test(`Comments count is changed`, async () => {
    await request(app).get(`/articles/f1HqPq/comments`)
      .expect((res) => expect(res.body.length).toBe(4));
  });
});

test(`API refuses to create a comment to non-existent article and return status code 404`, async () => {
  const app = createAPI();

  await request(app).post(`/articles/noexists/comments`).send({text: `comment`})
    .expect(HttpCode.NOT_FOUND);
});

test(`API refuses to create a comment when data is invalid, and returns status code 400`, async () => {
  const app = createAPI();
  await request(app).post(`/articles/f1HqPq/comments`).send({})
    .expect(HttpCode.BAD_REQUEST);
});

describe(`API correctly deletes a comment`, () => {
  const app = createAPI();
  let response;

  beforeAll(async () => {
    response = await request(app).delete(`/articles/f1HqPq/comments/7o6ls1`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Returns comment deleted`, () => expect(response.body.id).toBe(`7o6ls1`));
  test(`Comments count is 2 now`, async () => {
    await request(app).get(`/articles/f1HqPq/comments`)
      .expect((res) => expect(res.body.length).toBe(2));
  });
});

test(`API refuses to delete non-existent comment`, async () => {
  const app = createAPI();
  await request(app).delete(`/articles/f1HqPq/comments/noexists`).expect(HttpCode.NOT_FOUND);
});

test(`API refuses to delete a comment to non-existent offer`, async () => {
  const app = createAPI();
  await request(app).delete(`/articles/noexists/7o6ls1`).expect(HttpCode.NOT_FOUND);
});

