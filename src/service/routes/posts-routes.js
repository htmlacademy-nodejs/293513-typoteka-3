'use strict';

const express = require(`express`);
const fs = require(`fs`).promises;
const {FILE_NAME} = require(`../../constants`);

const postsRouter = new express.Router();

postsRouter.get(`/`, async (req, res) => {
  try {
    const fileContent = await fs.readFile(FILE_NAME, `utf-8`);
    const mocks = JSON.parse(fileContent);
    return res.json(mocks);
  } catch (err) {
    return res.json([]);
  }
});

module.exports = postsRouter;
