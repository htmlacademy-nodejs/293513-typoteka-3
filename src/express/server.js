'use strict';

const express = require(`express`);
const path = require(`path`);

const mainRoutes = require(`./routes/main-routes`);
const myRoutes = require(`./routes/my-routes`);
const articlesRoutes = require(`./routes/articles-routes`);
const {HttpCode} = require(`../constants`);
const {getLogger} = require(`../service/lib/logger`);

const DEFAULT_PORT = 8080;
const PUBLIC_DIR = `public`;

const app = express();
const logger = getLogger({name: `server`});

app.set(`views`, path.resolve(__dirname, `templates`));
app.set(`view engine`, `pug`);

app.use(express.static(path.resolve(__dirname, PUBLIC_DIR)));

app.use(`/`, mainRoutes);
app.use(`/my`, myRoutes);
app.use(`/articles`, articlesRoutes);

app.use((req, res) => res.status(HttpCode.BAD_REQUEST).render(`errors/400`));
app.use((err, req, res, _next) => {
  logger.error(`An error occurred on processing request: ${err.message}`);
  res.status(HttpCode.INTERNAL_SERVER_ERROR).render(`errors/500`);
});

app.listen(DEFAULT_PORT, (err) => {
  if (err) {
    return logger.error(`An error occurred on server created ${err.message}`);
  }

  return logger.info(`Listening to connection on ${DEFAULT_PORT}`);
});
