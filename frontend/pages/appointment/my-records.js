// pages/appointment/my-records.js
const storage = require('../../utils/storage');

Page({
  data: {
    currentTab: 'all',
    tabs: [
      { key: 'all', label: '全部' },
      { key: 'pending', label: '待确认' },
      { key: 'confirmed', label: '已排期' },
      { key: 'completed', label: '已完成' },
      { key: 'other', label: '已取消/驳回' }
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
    } else if (key === 'other') {
      this.setData({ records: all.filter(r => r.status === 'canceled' || r.status === 'rejected') });
    } else {
      this.setData({ records: all.filter(r => r.status === key) });
    }
  },

  cancelAppointment(e) {
    const id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '确认取消预约？',
      content: '取消后将释放该咨询师的时段资源，若需要可再次申请。',
      confirmColor: '#F5222D',
      success: (res) => {
        if (res.confirm) {
          storage.updateAppointmentStatus(id, 'canceled', '学生主动取消本次预约。');
          wx.showToast({ title: '已取消预约', icon: 'success' });
          this.loadRecords();
        }
      }
    });
  },

  rescheduleAppointment(e) {
    const item = e.currentTarget.dataset.item;
    wx.navigateTo({
      url: `/pages/appointment/detail?id=${item.counselorId}&rescheduleId=${item.id}`
    });
  },

  rebookCounselor(e) {
    const counselorId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/appointment/detail?id=${counselorId}`
    });
  },

  navToNewAppointment() {
    wx.switchTab({ url: '/pages/appointment/index' });
  }
});
