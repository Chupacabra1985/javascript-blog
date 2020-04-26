'use strict';

const optArticleSelector = '.post',
  optTitleSelector = '.post-title',
  optTitleListSelector = '.titles',
  optArticleTagsSelector = '.post-tags .list',
  authorSelector = '.post-author',
  optTagsListSelector = '.list.tags',
  optCloudClassCount = 5,
  optCloudClassPrefix = 'tag-size-',
  optAuthorsListSelector = '.list.authors';

const titleClickHandler = function(event){
  const clickedElement = this;
  const activeLinks = document.querySelectorAll('.titles a.active');

  for(let activeLink of activeLinks){
    activeLink.classList.remove('active');
  }

  clickedElement.classList.add('active');
  const activeArticles = document.querySelectorAll('.posts article.active');

  for(let activeArticle of activeArticles){
    activeArticle.classList.remove('active');
  }

  const articleSelector = clickedElement.getAttribute('href').replace('#','');
  const targetArticle = document.getElementById(articleSelector);
  targetArticle.classList.add('active');
  event.preventDefault();
};

function generateTitleLinks(customSelector = ''){
  let titleList = document.querySelector(optTitleListSelector);
  titleList.innerHTML = '';
  const articles = document.querySelectorAll(optArticleSelector + customSelector);
    
  for (const article of articles) {
    const articleId = article.getAttribute('id');
    const articleTitle = article.querySelector(optTitleSelector).innerHTML;
    titleList.insertAdjacentHTML('beforeend', '<li><a href="#' + articleId + '"><span>' + articleTitle + '</span></a></li>');
  }

  const links = document.querySelectorAll('.titles a');

  for(let link of links){
    link.addEventListener('click', titleClickHandler);
  }
}

generateTitleLinks();

function generateTags(){
  const articles = document.querySelectorAll(optArticleSelector);

  for (const article of articles) {
    const tagsList = article.getAttribute('data-tags');
    const articleTagsArray = tagsList.split(' ');
    let tagHtml = article.querySelector(optArticleTagsSelector);
    articleTagsArray.forEach((tag) => {
      tagHtml.insertAdjacentHTML('beforeend', '<li><a href="#tag-' + tag + '">' + tag + '</a></li>');
    });
  }
}

generateTags();

function tagClickHandler(event){
  event.preventDefault();
  const clickedElement = this;
  const href = clickedElement.getAttribute('href');
  const tag = href.replace('#tag-','');
  let allActiveLinks = document.querySelectorAll('a.active[href^="#tag-"]');
  allActiveLinks.forEach((link) => {
    link.classList.remove('active');
  });
  let linksToAddActive = document.querySelectorAll('a[href="' + href + '"]');
  linksToAddActive.forEach((link) => {
    link.classList.add('active');
  });
  generateTitleLinks('[data-tags~="' + tag + '"]');
}

function addClickListenersToTags(){
  const allLinks = document.querySelectorAll('[href^="#tag-"]');

  for(let link of allLinks){
    link.addEventListener('click', tagClickHandler);
  }
}

addClickListenersToTags();

function generateAuthors() {
  const articles = document.querySelectorAll(optArticleSelector);

  for (const article of articles) {
    const author = article.getAttribute('data-author');
    const authorTag = author.replace(' ', '-');
    let authorHtml = article.querySelector(authorSelector);
    authorHtml.insertAdjacentHTML('beforeend', '<a href="#' + authorTag + '">' + author + '</a>');
  }
}

generateAuthors();

function authorClickHandler(event) {
  event.preventDefault();
  const clickedElement = this;
  const href = clickedElement.getAttribute('href');
  const author = href.replace('#','').replace('-', ' ');
  let allActiveLinks = document.querySelectorAll('.post-author a.active');
  allActiveLinks.forEach((link) => {
    link.classList.remove('active');
  });
  let linksToAddActive = document.querySelectorAll('a[href="' + href + '"]');
  linksToAddActive.forEach((link) => {
    link.classList.add('active');
  });
  generateTitleLinks('[data-author="' + author + '"]');
}

function addClickListenersToAuthors() {
  const allLinks = document.querySelectorAll('.post-author a');

  for(let link of allLinks){
    link.addEventListener('click', authorClickHandler);
  }
}

addClickListenersToAuthors();

function calculateTagsParams(tags) {
  const params = {max: 0, min: 9999};
  for (let tag in tags) {
    params.max = Math.max(tags[tag], params.max);
    params.min = Math.min(tags[tag], params.min);
  }

  return params;
}

function calculateTagClass(count, params) {
  const normalizedCount = count - params.min;
  const normalizedMax = params.max - params.min;
  const percentage = normalizedCount / normalizedMax;

  return optCloudClassPrefix + Math.floor( percentage * (optCloudClassCount - 1) + 1 );
}

function generateIndexTags() {
  let allTags = {};
  let allTagsHTML = '';
  let tagList = document.querySelector(optTagsListSelector);
  const articles = document.querySelectorAll(optArticleSelector);

  for (let article of articles) {
    const tags = article.getAttribute('data-tags');
    const articleTagsArray = tags.split(' ');
    articleTagsArray.forEach((tag) => {
      if (!allTags[tag]) {
        allTags[tag] = 1;
      } else {
        allTags[tag]++;
      }
    });
  }

  const tagsParams = calculateTagsParams(allTags);

  for (let tag in allTags) {
    allTagsHTML += '<li class="' + calculateTagClass(allTags[tag], tagsParams) + '"><a href="#' + tag + '">'+ tag + '</a></li>';
  }

  tagList.innerHTML = allTagsHTML;
}

generateIndexTags();

function generateIndexAuthors() {
  let allAuthors = {};
  let allAuthorsHTML = '';
  let authorList = document.querySelector(optAuthorsListSelector);
  const articles = document.querySelectorAll(optArticleSelector);

  for (let article of articles) {
    const author = article.getAttribute('data-author');
    if (!allAuthors[author]) {
      allAuthors[author] = 1;
    } else {
      allAuthors[author]++;
    }
  }

  const authorsParams = calculateTagsParams(allAuthors);

  for (let author in allAuthors) {
    allAuthorsHTML += '<li class="' + calculateTagClass(allAuthors[author], authorsParams) + '"><a href="#' + author + '">'+ author + '</a></li>';
  }

  authorList.innerHTML = allAuthorsHTML;
}

generateIndexAuthors();