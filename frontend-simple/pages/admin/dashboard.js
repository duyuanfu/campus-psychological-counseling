// pages/admin/dashboard.js - 管理员后台
const storage = require('../../utils/storage');

Page({
  data: {
    admin: {}
  },

  onShow() {
    this.setData({ admin: storage.getCurrentUser() });
  },

  navTo(e) {
    wx.navigateTo({ url: e.currentTarget.dataset.url });
  },

  handleLogout() {
    wx.showModal({
      title: '提示',
      content: '确认退出登录？',
      success: (res) => {
        if (res.confirm) {
          wx.removeStorageSync('xys_token');
          wx.reLaunch({ url: '/pages/auth/login' });
        }
      }
    });
  }
});
