'use strict';

const {nanoid} = require(`nanoid`);
const fs = require(`fs`).promises;
const chalk = require(`chalk`);
const {getRandomInt, shuffle, getRandomDate} = require(`../../utils`);
const {
  ExitCode,
  MAX_ID_LENGTH,
  MAX_COMMENTS,
  FilePath,
  FileName,
  CountArticles
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

const generateComments = (count, comments) => (
  Array(count).fill({}).map(() => ({
    id: nanoid(MAX_ID_LENGTH),
    text: shuffle(comments)
      .slice(0, getRandomInt(1, comments.length))
      .join(` `),
  }))
);

const generateArticles = (count, titles, categories, sentences, comments) => {
  return Array(count).fill({}).map(() => ({
    id: nanoid(MAX_ID_LENGTH),
    title: titles[getRandomInt(0, titles.length - 1)],
    announce: shuffle(sentences).slice(0, getRandomInt(1, 5)).join(` `),
    fullText: shuffle(sentences).slice(0, getRandomInt(5, sentences.length - 1)).join(` `),
    createdAt: getRandomDate().toISOString(),
    category: shuffle(categories).slice(0, getRandomInt(1, categories.length - 1)),
    comments: generateComments(getRandomInt(1, MAX_COMMENTS), comments),
  }));
};

module.exports = {
  name: `--generate`,
  async run(args) {
    const titles = await readContent(FilePath.TITLES);
    const categories = await readContent(FilePath.CATEGORIES);
    const sentences = await readContent(FilePath.SENTENCES);
    const comments = await readContent(FilePath.COMMENTS);

    const [count] = args;
    const countArticles = Number.parseInt(count, 10) || CountArticles.DEFAULT;

    if (countArticles > CountArticles.MAX) {
      console.info(chalk.red(`Не больше 1000 объявлений`));
      return;
    }

    const content = JSON.stringify(generateArticles(countArticles, titles, categories, sentences, comments), null, 2);

    try {
      await fs.writeFile(FileName.MOCKS, content);
      console.log(chalk.green(`Operation success. File created.`));
    } catch (err) {
      console.error(chalk.red(`Can't write data to file...`));
      process.exit(ExitCode.ERROR);
    }
  }
};
