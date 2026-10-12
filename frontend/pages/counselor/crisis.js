// pages/counselor/crisis.js
const storage = require('../../utils/storage');

Page({
  data: {
    currentTab: 'all',
    tabs: [
      { key: 'all', label: '全部预警' },
      { key: 'pending', label: '待干预 (红色紧急)' },
      { key: 'handling', label: '干预跟进中' },
      { key: 'resolved', label: '已化解归档' }
    ],
    allAlerts: [],
    filteredAlerts: []
  },

  onShow() {
    this.loadAlerts();
  },

  onPullDownRefresh() {
    this.loadAlerts();
    wx.stopPullDownRefresh();
  },

  loadAlerts() {
    const list = storage.getCrisisAlerts();
    this.setData({ allAlerts: list });
    this.filterAlerts(this.data.currentTab);
  },

  switchTab(e) {
    const key = e.currentTarget.dataset.key;
    this.setData({ currentTab: key });
    this.filterAlerts(key);
  },

  filterAlerts(tab) {
    const all = this.data.allAlerts;
    if (tab === 'all') {
      this.setData({ filteredAlerts: all });
    } else {
      this.setData({ filteredAlerts: all.filter(a => a.status === tab) });
    }
  },

  callStudent(e) {
    const phone = e.currentTarget.dataset.phone;
    wx.makePhoneCall({
      phoneNumber: phone || '13900001111',
      fail() {
        wx.showToast({ title: '已模拟热线呼叫', icon: 'none' });
      }
    });
  },

  updateStatus(e) {
    const id = e.currentTarget.dataset.id;
    const nextStatus = e.currentTarget.dataset.status;

    wx.showModal({
      title: '更新处置进度',
      editable: true,
      placeholderText: '请输入本次跟进沟通备忘记录...',
      success: (res) => {
        if (res.confirm) {
          storage.updateCrisisStatus(id, nextStatus, res.content || '已进行辅导员协同与危机疏导。');
          wx.showToast({ title: '处置状态已更新', icon: 'success' });
          this.loadAlerts();
        }
      }
    });
  },

  viewStudentAssessmentHistory() {
    // 调转至测评报告详情
    const history = storage.getAssessmentHistory();
    if (history.length > 0) {
      wx.navigateTo({
        url: `/pages/assessment/report?id=${history[0].id}`
      });
    } else {
      wx.showToast({ title: '暂无量表作答记录', icon: 'none' });
    }
  }
});
