'use strict';

class CategoryService {
  constructor(articles) {
    this._articles = articles;
  }

  findAll() {
    const categories = this._articles.reduce((acc, article) => {
      article.category.forEach((item) => acc.add(item));
      return acc;
    }, new Set());

    return [...categories];
  }
}

module.exports = CategoryService;
