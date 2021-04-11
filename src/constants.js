'use strict';

const DEFAULT_COMMAND = `--help`;
const USER_ARGV_INDEX = 2;
const MAX_COMMENTS = 4;
const MAX_ID_LENGTH = 6;

const CountArticles = {
  DEFAULT: 1,
  MAX: 1000,
};

const FileName = {
  MOCKS: `mocks.json`,
  FILL_DB: `fill-db.sql`,
};

const FilePath = {
  SENTENCES: `./data/sentences.txt`,
  TITLES: `./data/titles.txt`,
  CATEGORIES: `./data/categories.txt`,
  COMMENTS: `./data/comments.txt`,
  API_PREFIX: `/api`,
};

const ExitCode = {
  ERROR: 1,
  SUCCESS: 0,
};

const HttpCode = {
  OK: 200,
  CREATED: 201,
  NOT_FOUND: 404,
  BAD_REQUEST: 400,
  INTERNAL_SERVER_ERROR: 500,
};

const Env = {
  DEVELOPMENT: `development`,
  PRODUCTION: `production`,
};

const DbPoolConnection = {
  MIN: 0,
  MAX: 5,
};

module.exports = {
  DEFAULT_COMMAND,
  USER_ARGV_INDEX,
  MAX_COMMENTS,
  MAX_ID_LENGTH,
  CountArticles,
  FileName,
  FilePath,
  ExitCode,
  HttpCode,
  Env,
  DbPoolConnection,
};
