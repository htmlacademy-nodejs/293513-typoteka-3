'use strict';

(() => {
  const SERVER_URL = `http://localhost:3000`;
  const COUNT_LAST_COMMENTS = 4;

  const socket = io(SERVER_URL);

  const createComment = (comment) => {
    const commentElement = document.createElement(`li`);
    commentElement.className = `last__list-item`;

    if (comment.users.avatar) {
      const img = document.createElement(`img`);
      img.className = `last__list-image`;
      img.width = 20;
      img.height = 20;
      img.src = `img/${comment.users.avatar}`;
      img.alt = comment.users.name;

      commentElement.append(img);
    } else {
      const span = document.createElement(`span`);
      span.className = `avatar last__list-image`;
      span.style.backgroundSize = `contain`;

      commentElement.append(span);
    }

    const userName = document.createElement(`b`);
    userName.className = `last__list-name`;
    userName.textContent = `${comment.users.name} ${comment.users.surname}`;
    commentElement.append(userName);

    const link = document.createElement(`a`);
    link.className = `last__list-link`;
    link.textContent = comment.text.length > 100
      ? `${comment.text.slice(0, 100)}...`
      : comment.text;
    commentElement.append(link);

    return commentElement;
  };

  const updateComments = (comment) => {
    const listComments = document.querySelector(`.last__list`);
    const commentElements = listComments.querySelectorAll(`li`);

    if (commentElements.length === COUNT_LAST_COMMENTS) {
      commentElements[commentElements.length - 1].remove();
    }

    listComments.prepend(createComment(comment));
  };

  const createHotArticle = (article) => {
    const hotArticleElement = document.createElement(`li`);
    hotArticleElement.className = `hot__list-item`;

    const link = document.createElement(`a`);
    link.className = `hot__list-link`;
    link.href = `/articles/${article.id}`;
    link.innerHTML = `
      ${article.announce.length > 100
        ? `${article.announce.slice(0, 100)}...`
        : article.announce}
      <sup class="hot__link-sup">${article.commentsCount}</sup>
    `;

    hotArticleElement.append(link);

    return hotArticleElement;
  };

  const updateHotArticles = (articles) => {
    const list = document.querySelector(`.hot__list`);
    const fragment = document.createDocumentFragment();

    articles.forEach((article) => {
      const articleEl = createHotArticle(article);
      fragment.append(articleEl);
    });

    list.innerHTML = ``;
    list.append(fragment);
  }

  socket.addEventListener(`comment:create`, ({comment, articles}) => {
    updateHotArticles(articles);
    updateComments(comment);
  });
})();
