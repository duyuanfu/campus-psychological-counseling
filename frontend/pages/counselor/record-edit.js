// pages/counselor/record-edit.js
const storage = require('../../utils/storage');

Page({
  data: {
    activeView: 'edit', // 'edit' | 'list'
    riskLevels: ['常规 (低风险)', '中度需关注', '重点高危 (需协同辅导员)'],
    riskIndex: 0,
    records: [],
    formData: {
      id: '',
      studentName: '',
      studentMajor: '',
      consultDate: '',
      duration: '50分钟',
      type: '个体心理咨询',
      riskLevel: '常规 (低风险)',
      mentalStatus: '神志清醒，思维表达清晰连贯，情绪存在轻中度焦虑，求助动机积极。',
      complaintSummary: '',
      assessmentResult: '',
      interventionStrategy: ''
    }
  },

  onLoad(options) {
    if (options.mode === 'list') {
      this.setData({ activeView: 'list' });
    }
    if (options.studentName) {
      this.setData({
        'formData.studentName': decodeURIComponent(options.studentName),
        'formData.consultDate': new Date().toISOString().slice(0, 10)
      });
    }
    this.loadRecords();
  },

  loadRecords() {
    const list = storage.getCounselingRecords();
    this.setData({ records: list });
  },

  switchView(e) {
    const view = e.currentTarget.dataset.view;
    this.setData({ activeView: view });
    if (view === 'list') this.loadRecords();
  },

  onInput(e) {
    const field = e.currentTarget.dataset.field;
    const value = e.detail.value;
    this.setData({ [`formData.${field}`]: value });
  },

  onRiskChange(e) {
    const idx = Number(e.detail.value);
    this.setData({
      riskIndex: idx,
      'formData.riskLevel': this.data.riskLevels[idx]
    });
  },

  saveRecord() {
    const data = this.data.formData;
    if (!data.studentName) {
      wx.showToast({ title: '请输入学生姓名', icon: 'none' });
      return;
    }
    if (!data.complaintSummary) {
      wx.showToast({ title: '请输入谈话摘要', icon: 'none' });
      return;
    }

    const counselor = storage.getCurrentUser();
    storage.saveCounselingRecord({
      ...data,
      counselorName: counselor.name || '陈清心',
      consultDate: data.consultDate || new Date().toISOString().slice(0, 10)
    });

    wx.showToast({ title: '咨询档案已保存', icon: 'success' });

    setTimeout(() => {
      this.loadRecords();
      this.setData({ activeView: 'list' });
    }, 1000);
  },

  editExisting(e) {
    const item = e.currentTarget.dataset.item;
    const riskIdx = this.data.riskLevels.indexOf(item.riskLevel);
    this.setData({
      formData: { ...item },
      riskIndex: riskIdx !== -1 ? riskIdx : 0,
      activeView: 'edit'
    });
  }
});
