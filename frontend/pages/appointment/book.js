// pages/appointment/book.js
const storage = require('../../utils/storage');

Page({
  data: {
    counselorId: '',
    counselor: {},
    currentUser: {},
    selectedDate: '',
    selectedSlot: '',
    selectedMode: '线下咨询',
    categories: ['学业与考研压力', '情绪低落与焦虑', '宿舍与人际关系', '恋爱与亲密关系', '生涯规划与就业', '家庭与成长议题'],
    categoryIndex: 0,
    description: '',
    phone: '13800138000',
    emergencyPhone: '13900139000',
    agreed: true,
    isReschedule: false,
    rescheduleAptId: ''
  },

  onLoad(options) {
    const counselorId = options.counselorId || 'c_2001';
    const selectedDate = options.date || new Date().toISOString().slice(0, 10);
    const selectedSlot = options.slot ? decodeURIComponent(options.slot) : '14:30 - 15:30';
    const isReschedule = options.isReschedule === 'true';
    const rescheduleAptId = options.rescheduleAptId || '';

    const counselor = storage.getCounselorById(counselorId);
    const currentUser = storage.getCurrentUser();

    this.setData({
      counselorId,
      counselor,
      currentUser,
      selectedDate,
      selectedSlot,
      selectedMode: counselor.availableModes ? counselor.availableModes[0] : '线下咨询',
      isReschedule,
      rescheduleAptId,
      phone: currentUser.phone || '138****6688'
    });
  },

  selectMode(e) {
    this.setData({ selectedMode: e.currentTarget.dataset.mode });
  },

  onCategoryChange(e) {
    this.setData({ categoryIndex: Number(e.detail.value) });
  },

  onDescriptionInput(e) {
    this.setData({ description: e.detail.value });
  },

  onPhoneInput(e) {
    this.setData({ phone: e.detail.value });
  },

  onEmergencyInput(e) {
    this.setData({ emergencyPhone: e.detail.value });
  },

  toggleAgreement() {
    this.setData({ agreed: !this.data.agreed });
  },

  submitAppointment() {
    if (!this.data.agreed) {
      wx.showToast({ title: '请先同意保密守则', icon: 'none' });
      return;
    }

    if (!this.data.phone) {
      wx.showToast({ title: '请填写联系电话', icon: 'none' });
      return;
    }

    const {
      isReschedule,
      rescheduleAptId,
      counselor,
      currentUser,
      selectedDate,
      selectedSlot,
      selectedMode,
      categories,
      categoryIndex,
      description,
      phone,
      emergencyPhone
    } = this.data;

    if (isReschedule && rescheduleAptId) {
      // 改约逻辑
      storage.rescheduleAppointment(rescheduleAptId, selectedDate, selectedSlot);
      wx.showToast({ title: '改约申请已提交', icon: 'success' });
      setTimeout(() => {
        wx.redirectTo({ url: '/pages/appointment/my-records' });
      }, 1000);
      return;
    }

    // 新增预约逻辑
    storage.createAppointment({
      studentId: currentUser.id,
      studentName: currentUser.name,
      studentPhone: phone,
      emergencyPhone,
      counselorId: counselor.id,
      counselorName: counselor.name,
      counselorTitle: counselor.title,
      date: selectedDate,
      timeSlot: selectedSlot,
      mode: selectedMode,
      location: counselor.location,
      problemCategory: categories[categoryIndex],
      description: description || '希望获得学业和情绪方面的专业支持'
    });

    wx.showModal({
      title: '预约申请已提交',
      content: `已成功向 ${counselor.name} 提交申请（${selectedDate} ${selectedSlot}），请等待咨询师确认。`,
      showCancel: false,
      confirmText: '查看记录',
      success: () => {
        wx.redirectTo({ url: '/pages/appointment/my-records' });
      }
    });
  }
});
