// pages/appointment/detail.js - 详情与排班
const storage = require('../../utils/storage');

Page({
  data: {
    counselorId: '',
    counselor: {},
    schedule: {},
    daysList: [],
    selectedDate: '',
    selectedSlot: ''
  },

  onLoad(options) {
    const id = options.id || 'c_2001';
    this.setData({ counselorId: id });
    this.loadData(id);
  },

  loadData(id) {
    const counselor = storage.getCounselorById(id);
    const schedule = storage.getCounselorSchedule(id);

    const weekMap = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    const daysList = [];
    const now = new Date();

    for (let i = 1; i <= 5; i++) {
      const d = new Date(now);
      d.setDate(now.getDate() + i);
      const weekDay = weekMap[d.getDay()];
      const m = d.getMonth() + 1;
      const day = d.getDate();
      const dateStr = `${d.getFullYear()}-${m < 10 ? '0' + m : m}-${day < 10 ? '0' + day : day}`;
      daysList.push({
        date: dateStr,
        dayStr: `${m}.${day}`,
        weekDay
      });
    }

    this.setData({
      counselor,
      schedule,
      daysList,
      selectedDate: daysList[0].date,
      selectedSlot: schedule.slots ? schedule.slots[0] : '14:30 - 15:30'
    });
  },

  selectDate(e) {
    this.setData({ selectedDate: e.currentTarget.dataset.date });
  },

  selectSlot(e) {
    this.setData({ selectedSlot: e.currentTarget.dataset.slot });
  },

  goToBook() {
    const { counselorId, selectedDate, selectedSlot } = this.data;
    wx.navigateTo({
      url: `/pages/appointment/book?counselorId=${counselorId}&date=${selectedDate}&slot=${encodeURIComponent(selectedSlot)}`
    });
  }
});
