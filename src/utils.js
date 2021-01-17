'use strict';

const format = require(`date-fns/format`);

const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const shuffle = (someArray) => {
  for (let i = someArray.length - 1; i > 0; i--) {
    const randomPosition = Math.floor(Math.random() * i);
    [someArray[i], someArray[randomPosition]] = [someArray[randomPosition], someArray[i]];
  }

  return someArray;
};

const getRandomDate = () => {
  const date = new Date();
  date.setMonth(date.getMonth() - getRandomInt(0, 3));
  date.setDate(getRandomInt(1, date.getDate()));
  date.setHours(getRandomInt(0, 23));
  date.setMinutes(getRandomInt(0, 59));
  date.setSeconds(getRandomInt(0, 59));

  return format(date, 'yyyy-MM-dd HH:mm:ss');
};

module.exports = {
  getRandomInt,
  shuffle,
  getRandomDate,
}
