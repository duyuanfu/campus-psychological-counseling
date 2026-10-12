// pages/counselor/dashboard.js
const app = getApp();
const storage = require('../../utils/storage');

Page({
  data: {
    counselor: {},
    pendingCount: 0,
    confirmedCount: 0,
    recordsCount: 0,
    crisisAlerts: [],
    pendingList: []
  },

  onShow() {
    this.loadDashboardData();
  },

  onPullDownRefresh() {
    this.loadDashboardData();
    wx.stopPullDownRefresh();
  },

  loadDashboardData() {
    const counselorUser = storage.getCurrentUser();
    const counselorId = counselorUser.id || 'c_2001';
    const counselor = storage.getCounselorById(counselorId);

    const appointments = storage.getAppointments({ counselorId });
    const pendingList = appointments.filter(a => a.status === 'pending');
    const confirmedList = appointments.filter(a => a.status === 'confirmed');
    const records = storage.getCounselingRecords();
    const crisisAlerts = storage.getCrisisAlerts().filter(c => c.status !== 'resolved');

    this.setData({
      counselor,
      pendingCount: pendingList.length,
      confirmedCount: confirmedList.length,
      recordsCount: records.length,
      crisisAlerts,
      pendingList
    });
  },

  navToSchedule() {
    wx.navigateTo({ url: '/pages/counselor/schedule' });
  },

  navToAppointments(e) {
    const tab = e.currentTarget.dataset.tab || 'all';
    wx.navigateTo({ url: `/pages/counselor/appointments?tab=${tab}` });
  },

  navToCrisis() {
    wx.navigateTo({ url: '/pages/counselor/crisis' });
  },

  navToRecordEdit() {
    wx.navigateTo({ url: '/pages/counselor/record-edit' });
  },

  navToRecords() {
    wx.navigateTo({ url: '/pages/counselor/record-edit?mode=list' });
  },

  dealAppointment(e) {
    const item = e.currentTarget.dataset.item;
    wx.navigateTo({ url: `/pages/counselor/appointments?id=${item.id}&tab=pending` });
  },

  handleLogout() {
    wx.showModal({
      title: '退出登录',
      content: '确认退出当前咨询师账号？',
      confirmColor: '#F5222D',
      success: (res) => {
        if (res.confirm) {
          wx.removeStorageSync('xys_token');
          wx.reLaunch({ url: '/pages/auth/login' });
        }
      }
    });
  }
});
