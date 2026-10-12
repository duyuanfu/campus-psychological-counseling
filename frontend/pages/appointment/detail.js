// pages/appointment/detail.js
const storage = require('../../utils/storage');

Page({
  data: {
    counselorId: '',
    counselor: {},
    schedule: {},
    availableDays: [],
    selectedDate: '',
    selectedSlot: ''
  },

  onLoad(options) {
    const id = options.id || 'c_2001';
    this.setData({ counselorId: id });
    this.loadCounselor(id);
  },

  loadCounselor(id) {
    const counselor = storage.getCounselorById(id);
    const schedule = storage.getCounselorSchedule(id);

    // 生成未来7天的可预约日期
    const availableDays = [];
    const weekMap = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    const now = new Date();

    for (let i = 1; i <= 7; i++) {
      const d = new Date(now);
      d.setDate(now.getDate() + i);

      const weekDay = weekMap[d.getDay()];
      const month = d.getMonth() + 1;
      const day = d.getDate();
      const dateStr = `${d.getFullYear()}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`;
      const hasSlot = schedule.days ? schedule.days.includes(weekDay) : true;

      availableDays.push({
        date: dateStr,
        dayStr: `${month}.${day}`,
        weekDay,
        hasSlot
      });
    }

    // 默认选择第一个有号的日期
    const firstAvailable = availableDays.find(d => d.hasSlot) || availableDays[0];

    this.setData({
      counselor,
      schedule,
      availableDays,
      selectedDate: firstAvailable ? firstAvailable.date : '',
      selectedSlot: schedule.slots && schedule.slots.length > 0 ? schedule.slots[0] : '14:30 - 15:30'
    });
  },

  onSelectDate(e) {
    const date = e.currentTarget.dataset.date;
    this.setData({ selectedDate: date });
  },

  onSelectSlot(e) {
    const slot = e.currentTarget.dataset.slot;
    this.setData({ selectedSlot: slot });
  },

  goToBookPage() {
    if (!this.data.selectedDate || !this.data.selectedSlot) {
      wx.showToast({ title: '请选择日期与时段', icon: 'none' });
      return;
    }
    const { counselorId, selectedDate, selectedSlot } = this.data;
    wx.navigateTo({
      url: `/pages/appointment/book?counselorId=${counselorId}&date=${selectedDate}&slot=${encodeURIComponent(selectedSlot)}`
    });
  }
});
