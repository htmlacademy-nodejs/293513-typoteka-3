'use strict';

module.exports.DEFAULT_COMMAND = `--help`;

module.exports.USER_ARGV_INDEX = 2;
module.exports.MAX_COMMENTS = 4;
module.exports.MAX_ID_LENGTH = 6;

module.exports.CountArticles = {
  DEFAULT: 1,
  MAX: 1000,
};

module.exports.FileName = {
  MOCKS: `mocks.json`,
  FILL_DB: `fill-db.sql`,
};

module.exports.FilePath = {
  SENTENCES: `./data/sentences.txt`,
  TITLES: `./data/titles.txt`,
  CATEGORIES: `./data/categories.txt`,
  COMMENTS: `./data/comments.txt`,
  API_PREFIX: `/api`,
};

module.exports.ExitCode = {
  ERROR: 1,
  SUCCESS: 0,
};

module.exports.HttpCode = {
  OK: 200,
  CREATED: 201,
  NOT_FOUND: 404,
  BAD_REQUEST: 400,
  INTERNAL_SERVER_ERROR: 500,
};

module.exports.Env = {
  DEVELOPMENT: `development`,
  PRODUCTION: `production`,
};
