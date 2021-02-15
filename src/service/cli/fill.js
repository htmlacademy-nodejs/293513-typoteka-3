'use strict';

const fs = require(`fs`).promises;
const chalk = require(`chalk`);
const {getRandomInt, shuffle, getRandomDate} = require(`../../utils`);
const {
  ExitCode,
  MAX_COMMENTS,
  FILE_NAME_FILL_DB,
  DEFAULT_COUNT_ARTICLES,
  MAX_COUNT_ARTICLES,
  FILE_SENTENCES_PATH,
  FILE_TITLES_PATH,
  FILE_CATEGORIES_PATH,
  FILE_COMMENTS_PATH,
} = require(`../../constants`);

const readContent = async (filePath) => {
  try {
    const content = await fs.readFile(filePath, `utf8`);
    return content.trim().split(`\n`);
  } catch (err) {
    console.error(chalk.red(err));
    return [];
  }
};

const generateComments = (count, articleId, userCount, comments) => (
  Array(count).fill({}).map(() => ({
    userId: getRandomInt(1, userCount),
    articleId,
    text: shuffle(comments)
      .slice(0, getRandomInt(1, comments.length))
      .join(` `),
  }))
);

const generateArticles = (count, titles, categoryCount, userCount, sentences, comments) => {
  return Array(count).fill({}).map((_, index) => ({
    userId: getRandomInt(1, userCount),
    title: titles[getRandomInt(0, titles.length - 1)],
    createdAt: getRandomDate().toISOString(),
    announce: shuffle(sentences).slice(0, getRandomInt(1, 5)).join(` `),
    fullText: shuffle(sentences).slice(0, getRandomInt(5, sentences.length - 1)).join(` `),
    category: [getRandomInt(1, categoryCount)],
    comments: generateComments(getRandomInt(1, MAX_COMMENTS), index + 1, userCount, comments),
  }));
};

module.exports = {
  name: `--fill`,
  async run(args) {
    const titles = await readContent(FILE_TITLES_PATH);
    const categories = await readContent(FILE_CATEGORIES_PATH);
    const sentences = await readContent(FILE_SENTENCES_PATH);
    const commentSentences = await readContent(FILE_COMMENTS_PATH);

    const users = [
      {
        email: `ivanov@example.com`,
        passwordHash: `5f4dcc3b5aa765d61d8327deb882cf99`,
        firstName: `Иван`,
        lastName: `Иванов`,
        avatar: `avatar1.jpg`
      },
      {
        email: `petrov@example.com`,
        passwordHash: `5f4dcc3b5aa765d61d8327deb882cf99`,
        firstName: `Пётр`,
        lastName: `Петров`,
        avatar: `avatar2.jpg`
      }
    ];

    const [count] = args;
    const countArticles = Number.parseInt(count, 10) || DEFAULT_COUNT_ARTICLES;

    if (countArticles > MAX_COUNT_ARTICLES) {
      console.info(chalk.red(`Не больше 1000 объявлений`));
      return;
    }

    const articles = generateArticles(countArticles, titles, categories.length, users.length, sentences, commentSentences);
    const comments = articles.flatMap((article) => article.comments);
    const articleCategories = articles.map((article, index) => ({articleId: index + 1, categoryId: article.category[0]}));

    const userValues = users.map(({firstName, lastName, passwordHash, avatar, email}) =>
      `('${firstName}', '${lastName}', '${passwordHash}', '${avatar}', '${email}')`
    ).join(`,\n`);

    const articleValues = articles.map(({userId, title, createdAt, announce, fullText}) =>
      `(${userId}, '${title}', '${createdAt}', '${announce}', '${fullText}')`
    ).join(`,\n`);

    const commentValues = comments.map(({articleId, userId, text}) =>
      `(${articleId}, ${userId}, '${text}')`
    ).join(`,\n`);

    const categoryValues = categories.map((name) => `('${name}')`).join(`,\n`);

    const articleCategoryValues = articleCategories.map(({articleId, categoryId}) =>
      `(${articleId}, ${categoryId})`
    ).join(`,\n`);

    const content = `
INSERT INTO users(first_name, last_name, password_hash, avatar, email) VALUES
${userValues};

ALTER TABLE articles DISABLE TRIGGER ALL;
INSERT INTO articles(user_id, title, created_at, announce, full_text) VALUES
${articleValues};
ALTER TABLE articles ENABLE TRIGGER ALL;

ALTER TABLE comments DISABLE TRIGGER ALL;
INSERT INTO comments(article_id, user_id, text) VALUES
${commentValues};
ALTER TABLE comments ENABLE TRIGGER ALL;

INSERT INTO categories(name) VALUES
${categoryValues};

ALTER TABLE article_category DISABLE TRIGGER ALL;
INSERT INTO article_category(article_id, category_id) VALUES
${articleCategoryValues};
ALTER TABLE article_category ENABLE TRIGGER ALL;
    `.trim();

    try {
      await fs.writeFile(FILE_NAME_FILL_DB, content);
      console.log(chalk.green(`Operation success. File created.`));
    } catch (err) {
      console.error(chalk.red(`Can't write data to file...`));
      process.exit(ExitCode.ERROR);
    }
  }
};
