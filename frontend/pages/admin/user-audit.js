// pages/admin/user-audit.js
Page({
  data: {
    currentTab: 'student', // 'student' | 'counselor'
    studentList: [
      {
        id: 's_aud_1',
        name: '王小萌',
        studentId: '2023020815',
        college: '数字媒体与设计学院',
        major: '动画艺术',
        grade: '大一',
        phone: '137****8899',
        status: 'pending',
        time: '2025-05-20 10:30'
      },
      {
        id: 's_aud_2',
        name: '林微光',
        studentId: '2022030142',
        college: '数字媒体与设计学院',
        major: '数字媒体艺术',
        grade: '大二',
        phone: '138****6688',
        status: 'approved',
        time: '2025-05-18 14:20'
      }
    ],
    counselorList: [
      {
        id: 'c_aud_1',
        name: '韩晓宁',
        title: '资深心理咨询督导师 / 副教授',
        qualification: '中国心理学会注册心理师 (CPS No.21-089)',
        tags: '意象对话、催眠放松、情绪调节',
        experience: '9年高校个案咨询经验',
        status: 'pending',
        time: '2025-05-19 16:45'
      },
      {
        id: 'c_aud_2',
        name: '陈清心',
        title: '国家二级心理咨询师 / 专职主任',
        qualification: '国家二级心理咨询师 (No.1802000045)',
        tags: 'CBT、危机干预、人际关系',
        experience: '12年高校个案经验',
        status: 'approved',
        time: '2025-05-10 09:15'
      }
    ]
  },

  switchTab(e) {
    this.setData({ currentTab: e.currentTarget.dataset.tab });
  },

  passStudent(e) {
    const id = e.currentTarget.dataset.id;
    const list = this.data.studentList.map(item => {
      if (item.id === id) item.status = 'approved';
      return item;
    });
    this.setData({ studentList: list });
    wx.showToast({ title: '已通过学籍实名认证', icon: 'success' });
  },

  rejectStudent(e) {
    const id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '驳回认证申请',
      editable: true,
      placeholderText: '请输入驳回原因...',
      success: (res) => {
        if (res.confirm) {
          const list = this.data.studentList.filter(item => item.id !== id);
          this.setData({ studentList: list });
          wx.showToast({ title: '已驳回申请', icon: 'none' });
        }
      }
    });
  },

  passCounselor(e) {
    const id = e.currentTarget.dataset.id;
    const list = this.data.counselorList.map(item => {
      if (item.id === id) item.status = 'approved';
      return item;
    });
    this.setData({ counselorList: list });
    wx.showToast({ title: '已核准入驻资质', icon: 'success' });
  },

  rejectCounselor(e) {
    const id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '驳回入驻申请',
      editable: true,
      placeholderText: '请输入驳回原因...',
      success: (res) => {
        if (res.confirm) {
          const list = this.data.counselorList.filter(item => item.id !== id);
          this.setData({ counselorList: list });
          wx.showToast({ title: '已驳回并通知补充', icon: 'none' });
        }
      }
    });
  }
});
