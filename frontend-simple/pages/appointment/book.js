// pages/appointment/book.js - 预约表单
const storage = require('../../utils/storage');

Page({
  data: {
    counselorId: '',
    counselor: {},
    selectedDate: '',
    selectedSlot: '',
    selectedMode: '线下咨询',
    categories: ['学业压力', '情绪焦虑', '人际关系', '恋爱情感', '生涯规划'],
    categoryIndex: 0,
    description: '',
    phone: '',
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
    const user = storage.getCurrentUser();

    this.setData({
      counselorId,
      counselor,
      selectedDate,
      selectedSlot,
      isReschedule,
      rescheduleAptId,
      phone: user.phone || '13800138000'
    });
  },

  onModeChange(e) { this.setData({ selectedMode: e.detail.value }); },
  onCategoryChange(e) { this.setData({ categoryIndex: Number(e.detail.value) }); },
  onInputDesc(e) { this.setData({ description: e.detail.value }); },
  onInputPhone(e) { this.setData({ phone: e.detail.value }); },

  submitAppointment() {
    const { counselor, selectedDate, selectedSlot, selectedMode, categories, categoryIndex, description, phone, isReschedule, rescheduleAptId } = this.data;
    const user = storage.getCurrentUser();

    if (!phone) {
      wx.showToast({ title: '请填写联系电话', icon: 'none' });
      return;
    }

    if (isReschedule && rescheduleAptId) {
      storage.rescheduleAppointment(rescheduleAptId, selectedDate, selectedSlot);
      wx.showToast({ title: '改约成功', icon: 'success' });
      setTimeout(() => {
        wx.redirectTo({ url: '/pages/appointment/my-records' });
      }, 800);
      return;
    }

    storage.createAppointment({
      studentId: user.id || 'u_1001',
      studentName: user.name || '林微光',
      studentPhone: phone,
      counselorId: counselor.id,
      counselorName: counselor.name,
      counselorTitle: counselor.title,
      date: selectedDate,
      timeSlot: selectedSlot,
      mode: selectedMode,
      location: counselor.location,
      problemCategory: categories[categoryIndex],
      description: description || '日常咨询沟通'
    });

    wx.showModal({
      title: '申请已提交',
      content: `已成功预约 ${counselor.name}（${selectedDate} ${selectedSlot}），等待确认。`,
      showCancel: false,
      confirmText: '查看记录',
      success: () => {
        wx.redirectTo({ url: '/pages/appointment/my-records' });
      }
    });
  }
});
