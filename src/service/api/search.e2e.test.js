'use strict';

const express = require(`express`);
const request = require(`supertest`);

const search = require(`./search`);
const SearchService = require(`../data-service/search`);
const {HttpCode} = require(`../../constants`);

const mockData = [
  {
    "id": `kuUKCQ`,
    "title": `Что такое золотое сечение`,
    "announce": `Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Это один из лучших рок-музыкантов. Как начать действовать? Для начала просто соберитесь. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем.`,
    "fullText": `Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Из под его пера вышло 8 платиновых альбомов. Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Собрать камни бесконечности легко, если вы прирожденный герой. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Он написал больше 30 хитов. Первая большая ёлка была установлена только в 1938 году. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Как начать действовать? Для начала просто соберитесь. Золотое сечение — соотношение двух величин, гармоническая пропорция. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике.`,
    "createdDate": `2021-01-25T01:59:39.473Z`,
    "category": [
      `Разное`,
      `Железо`,
      `За жизнь`,
      `Без рамки`,
      `Музыка`,
      `Деревья`,
      `Программирование`
    ],
    "comments": [
      {
        "id": `nKqf2t`,
        "text": `Планируете записать видосик на эту тему? Давно не пользуюсь стационарными компьютерами. Ноутбуки победили. Плюсую, но слишком много буквы! Мне не нравится ваш стиль. Ощущение, что вы меня поучаете.`
      }
    ]
  },
  {
    "id": `q2XNxd`,
    "title": `Как достигнуть успеха не вставая с кресла`,
    "announce": `Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры.`,
    "fullText": `Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Из под его пера вышло 8 платиновых альбомов. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Ёлки — это не просто красивое дерево. Это прочная древесина. Собрать камни бесконечности легко, если вы прирожденный герой. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Золотое сечение — соотношение двух величин, гармоническая пропорция. Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры. Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Программировать не настолько сложно, как об этом говорят. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Достичь успеха помогут ежедневные повторения. Это один из лучших рок-музыкантов.`,
    "createdDate": `2021-01-09T09:36:50.802Z`,
    "category": [
      `Кино`,
      `Разное`,
      `Программирование`,
      `За жизнь`,
      `Железо`,
      `Музыка`,
      `IT`
    ],
    "comments": [
      {
        "id": `7wsr4C`,
        "text": `Мне не нравится ваш стиль. Ощущение, что вы меня поучаете. Это где ж такие красоты? Мне кажется или я уже читал это где-то? Совсем немного... Согласен с автором! Планируете записать видосик на эту тему?`
      },
      {
        "id": `MDgPcl`,
        "text": `Плюсую, но слишком много буквы! Мне не нравится ваш стиль. Ощущение, что вы меня поучаете. Это где ж такие красоты? Планируете записать видосик на эту тему? Давно не пользуюсь стационарными компьютерами. Ноутбуки победили. Мне кажется или я уже читал это где-то? Согласен с автором! Совсем немного... Хочу такую же футболку :-)`
      },
      {
        "id": `6AiOSk`,
        "text": `Мне не нравится ваш стиль. Ощущение, что вы меня поучаете. Планируете записать видосик на эту тему?`
      }
    ]
  },
  {
    "id": `j20oXX`,
    "title": `Обзор новейшего смартфона`,
    "announce": `Золотое сечение — соотношение двух величин, гармоническая пропорция. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Как начать действовать? Для начала просто соберитесь.`,
    "fullText": `Он написал больше 30 хитов. Первая большая ёлка была установлена только в 1938 году. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Из под его пера вышло 8 платиновых альбомов. Золотое сечение — соотношение двух величин, гармоническая пропорция. Ёлки — это не просто красивое дерево. Это прочная древесина. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Достичь успеха помогут ежедневные повторения. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Простые ежедневные упражнения помогут достичь успеха. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Собрать камни бесконечности легко, если вы прирожденный герой. Программировать не настолько сложно, как об этом говорят. Как начать действовать? Для начала просто соберитесь. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем.`,
    "createdDate": `2020-12-18T16:30:12.970Z`,
    "category": [
      `Программирование`,
      `Железо`,
      `Деревья`,
      `Разное`,
      `Кино`
    ],
    "comments": [
      {
        "id": `YVdMZ7`,
        "text": `Совсем немного... Мне не нравится ваш стиль. Ощущение, что вы меня поучаете. Мне кажется или я уже читал это где-то? Согласен с автором! Плюсую, но слишком много буквы! Хочу такую же футболку :-)`
      }
    ]
  },
  {
    "id": `Z6OTbo`,
    "title": `Ёлки. История деревьев`,
    "announce": `Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами.`,
    "fullText": `Достичь успеха помогут ежедневные повторения. Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры. Первая большая ёлка была установлена только в 1938 году. Это один из лучших рок-музыкантов. Как начать действовать? Для начала просто соберитесь. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Он написал больше 30 хитов. Простые ежедневные упражнения помогут достичь успеха.`,
    "createdDate": `2020-12-29T06:08:51.619Z`,
    "category": [
      `Железо`,
      `Музыка`,
      `За жизнь`,
      `Без рамки`,
      `Разное`,
      `Деревья`
    ],
    "comments": [
      {
        "id": `8l3fDv`,
        "text": `Планируете записать видосик на эту тему?`
      },
      {
        "id": `t4o2Zs`,
        "text": `Мне кажется или я уже читал это где-то? Давно не пользуюсь стационарными компьютерами. Ноутбуки победили.`
      }
    ]
  },
  {
    "id": `9Cc72K`,
    "title": `Ёлки. История деревьев`,
    "announce": `Как начать действовать? Для начала просто соберитесь. Первая большая ёлка была установлена только в 1938 году. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете.`,
    "fullText": `Ёлки — это не просто красивое дерево. Это прочная древесина. Это один из лучших рок-музыкантов. Первая большая ёлка была установлена только в 1938 году. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Золотое сечение — соотношение двух величин, гармоническая пропорция.`,
    "createdDate": `2021-01-25T06:06:52.709Z`,
    "category": [
      `Музыка`,
      `За жизнь`,
      `IT`
    ],
    "comments": [
      {
        "id": `BiDtqH`,
        "text": `Хочу такую же футболку :-) Согласен с автором! Мне не нравится ваш стиль. Ощущение, что вы меня поучаете.`
      },
      {
        "id": `J23T2d`,
        "text": `Плюсую, но слишком много буквы! Давно не пользуюсь стационарными компьютерами. Ноутбуки победили. Это где ж такие красоты? Мне не нравится ваш стиль. Ощущение, что вы меня поучаете.`
      },
      {
        "id": `3WWQZe`,
        "text": `Совсем немного... Плюсую, но слишком много буквы! Мне не нравится ваш стиль. Ощущение, что вы меня поучаете. Согласен с автором! Это где ж такие красоты?`
      },
      {
        "id": `EL8T8Z`,
        "text": `Плюсую, но слишком много буквы! Согласен с автором! Мне кажется или я уже читал это где-то? Это где ж такие красоты?`
      }
    ]
  }
];

const app = express();
app.use(express.json());
search(app, new SearchService(mockData));

describe(`API returns articles based on search query`, () => {
  let response;

  beforeAll(async () => {
    response = await request(app)
      .get(`/search`)
      .query({
        query: `Ёлки`.toLowerCase(),
      });
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Two article found`, () => expect(response.body.length).toBe(2));
  test(`Article has correct id`, () => expect(response.body[0].id).toBe(`Z6OTbo`));
});

test(`API returns code 404 if nothing is found`, async () => {
  await request(app).get(`/search`).query({
    query: `Продам свою душу`,
  }).expect(HttpCode.NOT_FOUND);
});

test(`API returns code 400 when query string is absent`, async () => {
  await request(app).get(`/search`).expect(HttpCode.BAD_REQUEST);
});
