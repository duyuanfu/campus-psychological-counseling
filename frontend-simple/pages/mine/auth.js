// pages/mine/auth.js - 学籍认证
const storage = require('../../utils/storage');

Page({
  data: {
    name: '',
    studentId: '',
    colleges: [
      '数字媒体学院',
      '计算机科学学院',
      '经济管理学院',
      '外国语学院',
      '机电工程学院'
    ],
    collegeIndex: 0,
    majorGrade: '数字媒体技术 大二',
    phone: ''
  },

  onLoad() {
    const user = storage.getCurrentUser();
    this.setData({
      name: user.name || '林微光',
      studentId: user.studentId || '2022030142',
      phone: user.phone || '13800138000'
    });
  },

  onInput(e) {
    const field = e.currentTarget.dataset.field;
    this.setData({ [field]: e.detail.value });
  },

  onCollegeChange(e) {
    this.setData({ collegeIndex: Number(e.detail.value) });
  },

  saveAuth() {
    const { name, studentId, colleges, collegeIndex, phone, majorGrade } = this.data;
    storage.updateCurrentUser({
      name,
      studentId,
      college: colleges[collegeIndex],
      major: majorGrade,
      phone,
      isCertified: true
    });

    wx.showToast({ title: '保存成功', icon: 'success' });
    setTimeout(() => {
      wx.navigateBack();
    }, 600);
  }
});
