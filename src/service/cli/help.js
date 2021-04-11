'use strict';

const chalk = require(`chalk`);

module.exports = {
  name: `--help`,
  run() {
    const text = `
    Программа запускает http-сервер и формирует файл с данными для API.

    Гайд:
      server.js <command>

      Команды:
      --version:            выводит номер версии
      --help:               печатает этот текст
      --filldb <count>      заполняет базу данных начальной информацией
      --fill <count>        формирует файл fill-db.sql
      --server <port>       запускает сервер
    `;

    console.log(chalk.gray(text));
  }
};
