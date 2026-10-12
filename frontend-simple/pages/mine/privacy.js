// pages/mine/privacy.js - 隐私设置
const storage = require('../../utils/storage');

Page({
  data: {
    settings: {
      anonymousTreehole: true,
      hideRealNameFromCounselor: false,
      allowDataAnalysis: true
    }
  },

  onLoad() {
    const user = storage.getCurrentUser();
    if (user.privacySettings) {
      this.setData({ settings: user.privacySettings });
    }
  },

  onToggle(e) {
    const field = e.currentTarget.dataset.field;
    this.setData({ [`settings.${field}`]: e.detail.value });
  },

  saveSettings() {
    storage.updateCurrentUser({
      privacySettings: this.data.settings
    });
    wx.showToast({ title: '设置已保存', icon: 'success' });
    setTimeout(() => {
      wx.navigateBack();
    }, 600);
  }
});
