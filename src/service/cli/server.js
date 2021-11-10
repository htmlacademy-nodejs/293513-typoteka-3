'use strict';

const express = require(`express`);
const http = require(`http`);
const {HttpCode, ExitCode, FilePath} = require(`../../constants`);
const routes = require(`../api/api`);
const {getLogger} = require(`../lib/logger`);
const sequelize = require(`../lib/sequelize`);
const socket = require(`../lib/socket`);

module.exports = {
  name: `--server`,
  async run(args) {
    const DEFAULT_PORT = 3000;

    const logger = getLogger({name: `api`});

    try {
      logger.info(`Trying to connect to database...`);
      await sequelize.authenticate();
      logger.info(`Connection to database established`);
    } catch (err) {
      logger.error(`An error occurred: ${err.message}`);
      process.exit(ExitCode.ERROR);
    }

    const app = express();
    const server = http.createServer(app);

    app.locals.socketio = socket(server);

    app.use(express.json());

    app.use((req, res, next) => {
      logger.debug(`Request on route ${req.url}`);

      res.on(`finish`, () => {
        logger.info(`Response status code ${res.statusCode}`);
      });

      next();
    });

    app.use(FilePath.API_PREFIX, routes());

    app.use((req, res) => {
      res.status(HttpCode.NOT_FOUND).send(`Not found`);
      logger.error(`Route not found: ${req.url}`);
    });

    app.use((err, _req, _res, _next) => {
      logger.error(`An error occurred on processing request: ${err.message}`);
    });

    const [customPort] = args;
    const port = Number.parseInt(customPort, 10) || DEFAULT_PORT;

    server.listen(port, () => {
      logger.info(`Listening to connection on ${port}`);
    }).on(`error`, (err) => {
      logger.error(`An error occurred on server created ${err.message}`);
      process.exit(ExitCode.ERROR);
    });
  }
};
