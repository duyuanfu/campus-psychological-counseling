// pages/counselor/record-edit.js - 咨询记录
const storage = require('../../utils/storage');

Page({
  data: {
    studentName: '',
    studentMajor: '数字媒体技术 大二',
    duration: '50分钟',
    complaintSummary: '',
    interventionStrategy: ''
  },

  onLoad(options) {
    if (options.studentName) {
      this.setData({ studentName: decodeURIComponent(options.studentName) });
    }
  },

  onInput(e) {
    const field = e.currentTarget.dataset.field;
    this.setData({ [field]: e.detail.value });
  },

  saveRecord() {
    const { studentName, studentMajor, duration, complaintSummary, interventionStrategy } = this.data;
    if (!studentName || !complaintSummary) {
      wx.showToast({ title: '请填写姓名和摘要', icon: 'none' });
      return;
    }

    const counselor = storage.getCurrentUser();
    storage.saveCounselingRecord({
      studentName,
      studentMajor,
      counselorName: counselor.name || '陈清心',
      consultDate: new Date().toISOString().slice(0, 10),
      duration,
      type: '个体心理咨询',
      complaintSummary,
      interventionStrategy
    });

    wx.showToast({ title: '档案已保存', icon: 'success' });
    setTimeout(() => {
      wx.navigateBack();
    }, 600);
  }
});
