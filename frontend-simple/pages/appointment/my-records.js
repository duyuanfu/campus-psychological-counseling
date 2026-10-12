// pages/appointment/my-records.js - 预约记录
const storage = require('../../utils/storage');

Page({
  data: {
    currentTab: 'all',
    tabs: [
      { key: 'all', label: '全部' },
      { key: 'pending', label: '待确认' },
      { key: 'confirmed', label: '已排期' },
      { key: 'completed', label: '已完成' },
      { key: 'canceled', label: '已取消' }
    ],
    allRecords: [],
    records: []
  },

  onShow() {
    this.loadRecords();
  },

  onPullDownRefresh() {
    this.loadRecords();
    wx.stopPullDownRefresh();
  },

  loadRecords() {
    const user = storage.getCurrentUser();
    const all = storage.getAppointments({ studentId: user.id });
    this.setData({ allRecords: all });
    this.filterByTab(this.data.currentTab);
  },

  switchTab(e) {
    const key = e.currentTarget.dataset.key;
    this.setData({ currentTab: key });
    this.filterByTab(key);
  },

  filterByTab(key) {
    const all = this.data.allRecords;
    if (key === 'all') {
      this.setData({ records: all });
    } else {
      this.setData({ records: all.filter(r => r.status === key) });
    }
  },

  cancelApt(e) {
    const id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '确认取消',
      content: '确定要取消本次预约申请吗？',
      success: (res) => {
        if (res.confirm) {
          storage.updateAppointmentStatus(id, 'canceled', '学生主动取消。');
          wx.showToast({ title: '已取消', icon: 'success' });
          this.loadRecords();
        }
      }
    });
  },

  rescheduleApt(e) {
    const item = e.currentTarget.dataset.item;
    wx.navigateTo({
      url: `/pages/appointment/detail?id=${item.counselorId}&rescheduleId=${item.id}&isReschedule=true`
    });
  }
});
