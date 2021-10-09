'use strict';

const express = require(`express`);
const request = require(`supertest`);
const Sequelize = require(`sequelize`);

const initDb = require(`../lib/init-db`);
const category = require(`./category`);
const CategoryService = require(`../data-service/category`);
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

const mockDB = new Sequelize(`sqlite::memory:`, {logging: false});

const app = express();
app.use(express.json());

beforeAll(async () => {
  await initDb(mockDB, {
    articles: mockArticles,
    categories: mockCategories,
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
