// pages/mine/privacy.js
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

  onToggleAnonymous(e) {
    this.setData({ 'settings.anonymousTreehole': e.detail.value });
  },

  onToggleCounselor(e) {
    this.setData({ 'settings.hideRealNameFromCounselor': e.detail.value });
  },

  onToggleData(e) {
    this.setData({ 'settings.allowDataAnalysis': e.detail.value });
  },

  savePrivacy() {
    storage.updateCurrentUser({
      privacySettings: this.data.settings
    });
    wx.showToast({ title: '隐私设置已生效', icon: 'success' });
    setTimeout(() => {
      wx.navigateBack();
    }, 1000);
  }
});
