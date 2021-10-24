'use strict';

const express = require(`express`);
const path = require(`path`);
const session = require(`express-session`);
const SequelizeStore = require(`connect-session-sequelize`)(session.Store);

const sequelize = require(`../service/lib/sequelize`);
const mainRoutes = require(`./routes/main-routes`);
const myRoutes = require(`./routes/my-routes`);
const articlesRoutes = require(`./routes/articles-routes`);
const {HttpCode} = require(`../constants`);
const {getLogger} = require(`../service/lib/logger`);

const {SESSION_SECRET} = process.env;

if (!SESSION_SECRET) {
  throw new Error(`SESSION_SECRET environment variable is not defined`);
}

const DEFAULT_PORT = 8080;
const PUBLIC_DIR = `public`;
const UPLOAD_DIR = `upload`;
const EXPIRATION_TIME = 180000;
const CHECK_EXPIRATION_INTERVAL = 60000;

const mySessionStore = new SequelizeStore({
  db: sequelize,
  expiration: EXPIRATION_TIME,
  checkExpirationInterval: CHECK_EXPIRATION_INTERVAL,
});

sequelize.sync({force: false});

const app = express();
const logger = getLogger({name: `server`});

app.use(express.urlencoded({extended: false}));

app.use(session({
  secret: SESSION_SECRET,
  store: mySessionStore,
  resave: false,
  proxy: true,
  saveUninitialized: false,
}));

app.set(`views`, path.resolve(__dirname, `templates`));
app.set(`view engine`, `pug`);

app.use(express.static(path.resolve(__dirname, PUBLIC_DIR)));
app.use(express.static(path.resolve(__dirname, UPLOAD_DIR)));

app.use(`/`, mainRoutes);
app.use(`/my`, myRoutes);
app.use(`/articles`, articlesRoutes);

app.use((req, res) => res.status(HttpCode.BAD_REQUEST).render(`errors/400`));
app.use((err, req, res, _next) => {
  logger.error(`An error occurred on processing request: ${err.message}`);
  res.status(HttpCode.INTERNAL_SERVER_ERROR).render(`errors/500`);
});

app.listen(DEFAULT_PORT, () => {
  logger.info(`Listening to connection on ${DEFAULT_PORT}`);
}).on(`error`, (err) => {
  logger.error(`An error occurred on server created ${err.message}`);
});
