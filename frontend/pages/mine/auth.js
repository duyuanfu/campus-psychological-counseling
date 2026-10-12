// pages/mine/auth.js
const storage = require('../../utils/storage');

Page({
  data: {
    name: '',
    studentId: '',
    colleges: [
      '数字媒体与设计学院',
      '计算机科学与技术学院',
      '经济管理学院',
      '外国语学院',
      '机械与电气工程学院',
      '人文与法学院'
    ],
    collegeIndex: 0,
    majorGrade: '数字媒体艺术 大二',
    phone: ''
  },

  onLoad() {
    const user = storage.getCurrentUser();
    const collegeIdx = this.data.colleges.indexOf(user.college);

    this.setData({
      name: user.name || '林微光',
      studentId: user.studentId || '2022030142',
      collegeIndex: collegeIdx !== -1 ? collegeIdx : 0,
      phone: user.phone || '138****6688'
    });
  },

  onNameInput(e) { this.setData({ name: e.detail.value }); },
  onIdInput(e) { this.setData({ studentId: e.detail.value }); },
  onMajorInput(e) { this.setData({ majorGrade: e.detail.value }); },
  onPhoneInput(e) { this.setData({ phone: e.detail.value }); },
  onCollegeChange(e) { this.setData({ collegeIndex: Number(e.detail.value) }); },

  uploadCard() {
    wx.showToast({ title: '已模拟选择学生证', icon: 'success' });
  },

  saveAuth() {
    const { name, studentId, colleges, collegeIndex, phone } = this.data;
    storage.updateCurrentUser({
      name,
      studentId,
      college: colleges[collegeIndex],
      phone,
      isCertified: true
    });

    wx.showToast({ title: '认证信息已更新', icon: 'success' });
    setTimeout(() => {
      wx.navigateBack();
    }, 1000);
  }
});
