// pages/mine/index.js - 个人中心
const storage = require('../../utils/storage');

Page({
  data: {
    currentRole: 'student',
    userInfo: {},
    stats: {
      aptCount: 0,
      reportCount: 0,
      diaryCount: 0
    }
  },

  onShow() {
    this.loadUserData();
  },

  loadUserData() {
    const role = storage.getCurrentRole();
    const user = storage.getCurrentUser();
    const apts = storage.getAppointments({ studentId: user.id });
    const reports = storage.getAssessmentHistory();
    const diaries = storage.getMoodDiaries();

    this.setData({
      currentRole: role,
      userInfo: user,
      stats: {
        aptCount: apts.length,
        reportCount: reports.length,
        diaryCount: diaries.length
      }
    });
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

  handleLogout() {
    wx.showModal({
      title: '提示',
      content: '确认退出登录？',
      confirmColor: '#ed4014',
      success: (res) => {
        if (res.confirm) {
          wx.removeStorageSync('xys_token');
          wx.reLaunch({ url: '/pages/auth/login' });
        }
      }
    });
  }
});
