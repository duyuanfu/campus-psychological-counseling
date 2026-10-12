// pages/counselor/appointments.js
const storage = require('../../utils/storage');

Page({
  data: {
    currentTab: 'all',
    tabs: [
      { key: 'all', label: '全部' },
      { key: 'pending', label: '待审核' },
      { key: 'confirmed', label: '已排期' },
      { key: 'completed', label: '已完成' },
      { key: 'rejected', label: '已驳回' }
    ],
    allList: [],
    list: [],

    // 弹窗状态
    showConfirmModal: false,
    showRejectModal: false,
    selectedApt: null,
    confirmLocation: '阳光校区 心理健康中心 302室',
    confirmNotes: '已确认预约，请提前5分钟到达，保持轻松心情。',
    rejectReason: ''
  },

  onLoad(options) {
    if (options.tab) {
      this.setData({ currentTab: options.tab });
    }
  },

  onShow() {
    this.loadAppointments();
  },

  onPullDownRefresh() {
    this.loadAppointments();
    wx.stopPullDownRefresh();
  },

  loadAppointments() {
    const counselor = storage.getCurrentUser();
    const counselorId = counselor.id || 'c_2001';
    const all = storage.getAppointments({ counselorId });

    this.setData({ allList: all });
    this.filterList(this.data.currentTab);
  },

  switchTab(e) {
    const key = e.currentTarget.dataset.key;
    this.setData({ currentTab: key });
    this.filterList(key);
  },

  filterList(tab) {
    const all = this.data.allList;
    if (tab === 'all') {
      this.setData({ list: all });
    } else {
      this.setData({ list: all.filter(item => item.status === tab) });
    }
  },

  // 打开确认接单弹窗
  openConfirmModal(e) {
    const item = e.currentTarget.dataset.item;
    this.setData({
      selectedApt: item,
      confirmLocation: item.location || '阳光校区 心理健康中心 302室',
      showConfirmModal: true
    });
  },

  onConfirmLocationInput(e) { this.setData({ confirmLocation: e.detail.value }); },
  onConfirmNotesInput(e) { this.setData({ confirmNotes: e.detail.value }); },

  submitConfirm() {
    const { selectedApt, confirmLocation, confirmNotes } = this.data;
    if (!selectedApt) return;

    storage.updateAppointmentStatus(
      selectedApt.id,
      'confirmed',
      `地点：${confirmLocation}。${confirmNotes}`
    );

    wx.showToast({ title: '已确认接单排期', icon: 'success' });
    this.closeModals();
    this.loadAppointments();
  },

  // 打开驳回弹窗
  openRejectModal(e) {
    const item = e.currentTarget.dataset.item;
    this.setData({
      selectedApt: item,
      rejectReason: '',
      showRejectModal: true
    });
  },

  onRejectReasonInput(e) { this.setData({ rejectReason: e.detail.value }); },

  submitReject() {
    const { selectedApt, rejectReason } = this.data;
    if (!rejectReason.trim()) {
      wx.showToast({ title: '请填写驳回原因', icon: 'none' });
      return;
    }

    storage.updateAppointmentStatus(
      selectedApt.id,
      'rejected',
      `驳回原因：${rejectReason.trim()}`
    );

    wx.showToast({ title: '已驳回该申请', icon: 'success' });
    this.closeModals();
    this.loadAppointments();
  },

  markComplete(e) {
    const item = e.currentTarget.dataset.item;
    wx.showModal({
      title: '标记为咨询已完成？',
      content: '确认本次咨询已顺利完成？完成后可建立咨询档案。',
      success: (res) => {
        if (res.confirm) {
          storage.updateAppointmentStatus(item.id, 'completed', '咨询已顺利完成。');
          wx.showToast({ title: '已标记完成', icon: 'success' });
          this.loadAppointments();
        }
      }
    });
  },

  writeRecord(e) {
    const item = e.currentTarget.dataset.item;
    wx.navigateTo({
      url: `/pages/counselor/record-edit?aptId=${item.id}&studentName=${encodeURIComponent(item.studentName)}`
    });
  },

  closeModals() {
    this.setData({
      showConfirmModal: false,
      showRejectModal: false,
      selectedApt: null
    });
  }
});
