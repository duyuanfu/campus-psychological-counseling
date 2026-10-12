// pages/index/index.js - 首页逻辑
const storage = require('../../utils/storage');

Page({
  data: {
    selectedMood: 0,
    moods: [
      { score: 5, icon: '😄', name: '开心' },
      { score: 4, icon: '🙂', name: '良好' },
      { score: 3, icon: '😐', name: '平静' },
      { score: 2, icon: '🙁', name: '焦虑' },
      { score: 1, icon: '😞', name: '低落' }
    ],
    counselors: [],
    articles: []
  },

  onShow() {
    this.loadData();
  },

  onPullDownRefresh() {
    this.loadData();
    wx.stopPullDownRefresh();
  },

  loadData() {
    const counselors = storage.getCounselors();
    const articles = storage.getArticles();
    this.setData({
      counselors: counselors.slice(0, 3),
      articles: articles.slice(0, 3)
    });
  },

  quickMood(e) {
    const item = e.currentTarget.dataset.item;
    this.setData({ selectedMood: item.score });

    storage.saveMoodDiary({
      moodScore: item.score,
      moodIcon: item.icon,
      moodText: item.name,
      tags: ['首页打卡'],
      content: `今日心情记录：${item.name}`
    });

    wx.showToast({ title: `已记录: ${item.name}`, icon: 'success' });
  },

  navTo(e) {
    const url = e.currentTarget.dataset.url;
    const isTab = e.currentTarget.dataset.tab;
    if (isTab) {
      wx.switchTab({ url });
    } else {
      wx.navigateTo({ url });
    }
  },

  navToBook(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/appointment/book?counselorId=${id}`
    });
  },

  navToArticle(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/relax/article?id=${id}`
    });
  }
});
