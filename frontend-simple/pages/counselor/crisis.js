// pages/counselor/crisis.js - 危机预警
const storage = require('../../utils/storage');

Page({
  data: {
    alerts: []
  },

  onShow() {
    this.loadData();
  },

  loadData() {
    const list = storage.getCrisisAlerts();
    this.setData({ alerts: list });
  },

  callStudent(e) {
    const phone = e.currentTarget.dataset.phone;
    wx.makePhoneCall({
      phoneNumber: phone || '13900001122',
      fail() {
        wx.showToast({ title: '已模拟呼叫', icon: 'none' });
      }
    });
  },

  updateStatus(e) {
    const id = e.currentTarget.dataset.id;
    const status = e.currentTarget.dataset.status;

    wx.showModal({
      title: '更新进度',
      editable: true,
      placeholderText: '请输入跟进备注...',
      success: (res) => {
        if (res.confirm) {
          storage.updateCrisisStatus(id, status, res.content || '已完成电话/面对面安抚。');
          wx.showToast({ title: '已更新', icon: 'success' });
          this.loadData();
        }
      }
    });
  }
});
