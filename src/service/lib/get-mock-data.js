'use strict';

const fs = require(`fs`).promises;
const {FILE_NAME} = require(`../../constants`);

let data = [];

const getMockData = async () => {
  if (data.length > 0) {
    return data;
  }

  try {
    const fileContent = await fs.readFile(FILE_NAME, `utf-8`);
    data = JSON.parse(fileContent);
  } catch (err) {
    return data;
  }

  return data;
};

module.exports = getMockData;
