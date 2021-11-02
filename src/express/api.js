'use strict';

const axios = require(`axios`);
const {HttpMethod} = require('../constants');
const {getLogger} = require(`../service/lib/logger`);

const logger = getLogger({name: `api`});
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
    try {
      const {data} = await this._http.request(({url, ...options}));
      return data;
    } catch (e) {
      logger.error(e);
      throw e;
    }
  }

  getArticles({offset, limit, comments, categoryId} = {}) {
    return this._load(`/articles`, {
      params: {offset, limit, comments, categoryId},
    });
  }

  getPopularArticles(count) {
    return this._load(`/articles/popular`, {
      params: {count},
    });
  }

  getArticleById(id, comments) {
    return this._load(`/articles/${id}`, {
      params: {comments},
    });
  }

  createArticle(data) {
    return this._load(`/articles`, {
      method: HttpMethod.POST,
      data,
    });
  }

  editArticle(id, data) {
    return this._load(`/articles/${id}`, {
      method: HttpMethod.PUT,
      data,
    });
  }

  deleteArticle(id) {
    return this._load(`/articles/${id}`, {
      method: HttpMethod.DELETE,
    });
  }

  getCategories(count) {
    return this._load(`/categories`, {
      params: {count},
    });
  }

  getCategoryById(id, articles) {
    return this._load(`/categories/${id}`, {
      params: {articles}
    });
  }

  createCategory(data) {
    return this._load(`/categories`, {
      method: HttpMethod.POST,
      data
    });
  }

  editCategory(id, data) {
    return this._load(`/categories/${id}`, {
      method: HttpMethod.PUT,
      data
    });
  }

  deleteCategory(id) {
    return this._load(`/categories/${id}`, {
      method: HttpMethod.DELETE,
    });
  }

  getComments(count, needArticle) {
    return this._load(`/articles/comments`, {
      params: {count, needArticle}
    });
  }

  deleteComment(articleId, commentId) {
    return this._load(`/articles/${articleId}/comments/${commentId}`, {
      method: HttpMethod.DELETE,
    });
  }

  createComment(id, data) {
    return this._load(`/articles/${id}/comments`, {
      method: HttpMethod.POST,
      data,
    });
  }

  search(query) {
    return this._load(`/search`, {params: {query}});
  }

  createUser(data) {
    return this._load(`/user`, {
      method: HttpMethod.POST,
      data
    });
  }

  auth(email, password) {
    return this._load(`/user/auth`, {
      method: HttpMethod.POST,
      data: {email, password}
    });
  }
}

const defaultAPI = new API(defaultURL, TIMEOUT);

module.exports = {
  API,
  getAPI: () => defaultAPI,
};
