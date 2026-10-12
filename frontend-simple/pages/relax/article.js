// pages/relax/article.js - 文章详情
const storage = require('../../utils/storage');

Page({
  data: {
    article: {}
  },

  onLoad(options) {
    const id = options.id || 'art_1';
    const a = storage.getArticleById(id);
    this.setData({ article: a || {} });
  }
});
