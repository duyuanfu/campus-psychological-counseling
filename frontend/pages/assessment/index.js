// pages/assessment/index.js
const storage = require('../../utils/storage');

Page({
  data: {
    scales: [],
    historyList: [],
    latestReport: null
  },

  onShow() {
    this.loadData();
  },

  onPullDownRefresh() {
    this.loadData();
    wx.stopPullDownRefresh();
  },

  loadData() {
    const scales = storage.getScales();
    const historyList = storage.getAssessmentHistory();
    const latestReport = historyList.length > 0 ? historyList[0] : null;

    this.setData({
      scales,
      historyList,
      latestReport
    });
  },

  startTest(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/assessment/test?id=${id}`
    });
  },

  viewReportDetail(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/assessment/report?id=${id}`
    });
  }
});
