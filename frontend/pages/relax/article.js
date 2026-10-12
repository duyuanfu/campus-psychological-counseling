// pages/relax/article.js
const storage = require('../../utils/storage');

Page({
  data: {
    articleId: '',
    article: null,
    isLiked: false,
    likesCount: 0
  },

  onLoad(options) {
    const id = options.id || 'art_1';
    this.setData({ articleId: id });
    this.loadArticle(id);
  },

  loadArticle(id) {
    const article = storage.getArticleById(id);
    if (article) {
      this.setData({
        article,
        likesCount: article.likesCount || 108
      });
    }
  },

  toggleLike() {
    const isLiked = !this.data.isLiked;
    const likesCount = isLiked ? this.data.likesCount + 1 : this.data.likesCount - 1;

    this.setData({
      isLiked,
      likesCount
    });

    wx.vibrateShort && wx.vibrateShort({ type: 'light' });
  }
});
