// pages/counselor/appointments.js - 预约审核
const storage = require('../../utils/storage');

Page({
  data: {
    currentTab: 'pending',
    tabs: [
      { key: 'pending', label: '待审核' },
      { key: 'confirmed', label: '已排期' },
      { key: 'completed', label: '已完成' },
      { key: 'rejected', label: '已驳回' }
    ],
    allList: [],
    list: []
  },

  onShow() {
    this.loadData();
  },

  loadData() {
    const user = storage.getCurrentUser();
    const all = storage.getAppointments({ counselorId: user.id || 'c_2001' });
    this.setData({ allList: all });
    this.filterList(this.data.currentTab);
  },

  switchTab(e) {
    const key = e.currentTarget.dataset.key;
    this.setData({ currentTab: key });
    this.filterList(key);
  },

  filterList(key) {
    const all = this.data.allList;
    this.setData({ list: all.filter(item => item.status === key) });
  },

  confirmApt(e) {
    const item = e.currentTarget.dataset.item;
    storage.updateAppointmentStatus(item.id, 'confirmed', '老师已接单，请提前5分钟到心理中心302室。');
    wx.showToast({ title: '已确认接单', icon: 'success' });
    this.loadData();
  },

  rejectApt(e) {
    const item = e.currentTarget.dataset.item;
    wx.showModal({
      title: '驳回申请',
      editable: true,
      placeholderText: '请输入驳回理由...',
      success: (res) => {
        if (res.confirm) {
          storage.updateAppointmentStatus(item.id, 'rejected', res.content || '时间冲突，建议改约其他时段。');
          wx.showToast({ title: '已驳回', icon: 'none' });
          this.loadData();
        }
      }
    });
  },

  completeApt(e) {
    const item = e.currentTarget.dataset.item;
    storage.updateAppointmentStatus(item.id, 'completed', '咨询顺利完成。');
    wx.showToast({ title: '已完成', icon: 'success' });
    this.loadData();
  },

  writeRecord(e) {
    const item = e.currentTarget.dataset.item;
    wx.navigateTo({
      url: `/pages/counselor/record-edit?studentName=${encodeURIComponent(item.studentName)}`
    });
  }
});
