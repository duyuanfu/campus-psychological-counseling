// pages/assessment/index.js - 测评列表
const storage = require('../../utils/storage');

Page({
  data: {
    scales: [],
    history: []
  },

  onShow() {
    this.loadData();
  },

  loadData() {
    const scales = storage.getScales();
    const history = storage.getAssessmentHistory();
    this.setData({ scales, history });
  },

  startTest(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/assessment/test?id=${id}`
    });
  },

  viewReport(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/assessment/report?id=${id}`
    });
  }
});
