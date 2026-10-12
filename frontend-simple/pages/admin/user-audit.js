// pages/admin/user-audit.js - 审核
Page({
  data: {
    currentTab: 'student',
    students: [
      { id: '1', name: '王小萌', studentId: '2023020815', college: '数字媒体学院', major: '动画艺术', grade: '大一', phone: '13700008899', status: 'pending' },
      { id: '2', name: '林微光', studentId: '2022030142', college: '数字媒体学院', major: '数字媒体技术', grade: '大二', phone: '13800138000', status: 'approved' }
    ],
    counselors: [
      { id: '1', name: '韩晓宁', title: '心理咨询师', qualification: '注册心理师 (CPS No.21-089)', tags: '情绪调节', status: 'pending' },
      { id: '2', name: '陈清心', title: '专职主任', qualification: '国家二级心理咨询师', tags: '危机干预', status: 'approved' }
    ]
  },

  switchTab(e) {
    this.setData({ currentTab: e.currentTarget.dataset.tab });
  },

  passStudent(e) {
    const id = e.currentTarget.dataset.id;
    const list = this.data.students.map(s => {
      if (s.id === id) s.status = 'approved';
      return s;
    });
    this.setData({ students: list });
    wx.showToast({ title: '已通过认证', icon: 'success' });
  },

  rejectStudent(e) {
    const id = e.currentTarget.dataset.id;
    this.setData({ students: this.data.students.filter(s => s.id !== id) });
    wx.showToast({ title: '已驳回', icon: 'none' });
  },

  passCounselor(e) {
    const id = e.currentTarget.dataset.id;
    const list = this.data.counselors.map(c => {
      if (c.id === id) c.status = 'approved';
      return c;
    });
    this.setData({ counselors: list });
    wx.showToast({ title: '已准予入驻', icon: 'success' });
  },

  rejectCounselor(e) {
    const id = e.currentTarget.dataset.id;
    this.setData({ counselors: this.data.counselors.filter(c => c.id !== id) });
    wx.showToast({ title: '已驳回', icon: 'none' });
  }
});
