// pages/counselor/dashboard.js - 咨询师工作台
const storage = require('../../utils/storage');

Page({
  data: {
    counselor: {},
    pendingCount: 0,
    confirmedCount: 0,
    crisisCount: 0
  },

  onShow() {
    this.loadData();
  },

  loadData() {
    const user = storage.getCurrentUser();
    const counselor = storage.getCounselorById(user.id || 'c_2001');
    const apts = storage.getAppointments({ counselorId: user.id || 'c_2001' });
    const alerts = storage.getCrisisAlerts().filter(a => a.status !== 'resolved');

    this.setData({
      counselor,
      pendingCount: apts.filter(a => a.status === 'pending').length,
      confirmedCount: apts.filter(a => a.status === 'confirmed').length,
      crisisCount: alerts.length
    });
  },

  navTo(e) {
    wx.navigateTo({
      url: e.currentTarget.dataset.url
    });
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
