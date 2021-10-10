'use strict';

const axios = require(`axios`);

const TIMEOUT = 5000;
const port = process.env.API_PORT || 3000;
const defaultURL = `http://localhost:${port}/api/`;

class API {
  constructor(baseURL, timeout) {
    this._http = axios.create({
      baseURL,
      timeout,
    });
  }

  async _load(url, options) {
    const response = await this._http.request(({url, ...options}));
    return response.data;
  }

  getArticles({offset, limit, comments} = {}) {
    return this._load(`/articles`, {
      params: {offset, limit, comments},
    });
  }

  getArticleById(id, comments) {
    return this._load(`/articles/${id}`, {
      params: {comments},
    });
  }

  createArticle(data) {
    return this._load(`/articles`, {
      method: `POST`,
      data,
    });
  }

  getCategories(count) {
    return this._load(`/categories`, {
      params: {count},
    });
  }

  getComments(count) {
    return this._load(`/articles/comments`, {
      params: {count}
    });
  }

  search(query) {
    return this._load(`/search`, {params: {query}});
  }
}

const defaultAPI = new API(defaultURL, TIMEOUT);

module.exports = {
  API,
  getAPI: () => defaultAPI,
};
