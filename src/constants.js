'use strict';

module.exports.DEFAULT_COMMAND = `--help`;

module.exports.USER_ARGV_INDEX = 2;
module.exports.MAX_ID_LENGTH = 6;
module.exports.MAX_COMMENTS = 4;
module.exports.DEFAULT_COUNT_ARTICLES = 1;
module.exports.MAX_COUNT_ARTICLES = 1000;

module.exports.FILE_NAME_MOCKS = `mocks.json`;
module.exports.FILE_NAME_FILL_DB = `fill-db.sql`;
module.exports.FILE_SENTENCES_PATH = `./data/sentences.txt`;
module.exports.FILE_TITLES_PATH = `./data/titles.txt`;
module.exports.FILE_CATEGORIES_PATH = `./data/categories.txt`;
module.exports.FILE_COMMENTS_PATH = `./data/comments.txt`;

module.exports.API_PREFIX = `/api`;

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
