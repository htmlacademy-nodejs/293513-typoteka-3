'use strict';

const help = require(`./help`);
const version = require(`./version`);
const filldb = require(`./filldb`);
const server = require(`./server`);
const fill = require(`./fill`);

module.exports = {
  [help.name]: help,
  [version.name]: version,
  [filldb.name]: filldb,
  [server.name]: server,
  [fill.name]: fill,
};
