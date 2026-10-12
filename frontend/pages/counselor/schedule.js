// pages/counselor/schedule.js
const storage = require('../../utils/storage');

Page({
  data: {
    counselorId: 'c_2001',
    allDays: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
    selectedDaysMap: {},
    allSlots: [
      '09:00 - 10:00',
      '10:30 - 11:30',
      '14:00 - 15:00',
      '14:30 - 15:30',
      '16:00 - 17:00',
      '18:30 - 19:30'
    ],
    selectedSlotsMap: {},
    maxPerDay: 4
  },

  onLoad() {
    const user = storage.getCurrentUser();
    const counselorId = user.id || 'c_2001';
    const schedule = storage.getCounselorSchedule(counselorId);

    const daysMap = {};
    (schedule.days || ['周二', '周三', '周四', '周五']).forEach(d => {
      daysMap[d] = true;
    });

    const slotsMap = {};
    (schedule.slots || ['09:00 - 10:00', '14:30 - 15:30']).forEach(s => {
      slotsMap[s] = true;
    });

    this.setData({
      counselorId,
      selectedDaysMap: daysMap,
      selectedSlotsMap: slotsMap,
      maxPerDay: schedule.maxPerDay || 4
    });
  },

  toggleDay(e) {
    const day = e.currentTarget.dataset.day;
    const map = { ...this.data.selectedDaysMap };
    map[day] = !map[day];
    this.setData({ selectedDaysMap: map });
  },

  toggleSlot(e) {
    const slot = e.currentTarget.dataset.slot;
    const map = { ...this.data.selectedSlotsMap };
    map[slot] = !map[slot];
    this.setData({ selectedSlotsMap: map });
  },

  decreaseMax() {
    if (this.data.maxPerDay > 1) {
      this.setData({ maxPerDay: this.data.maxPerDay - 1 });
    }
  },

  increaseMax() {
    if (this.data.maxPerDay < 8) {
      this.setData({ maxPerDay: this.data.maxPerDay + 1 });
    }
  },

  saveSchedule() {
    const { counselorId, selectedDaysMap, selectedSlotsMap, maxPerDay } = this.data;
    const days = Object.keys(selectedDaysMap).filter(k => selectedDaysMap[k]);
    const slots = Object.keys(selectedSlotsMap).filter(k => selectedSlotsMap[k]);

    if (days.length === 0) {
      wx.showToast({ title: '请至少开放一个星期', icon: 'none' });
      return;
    }
    if (slots.length === 0) {
      wx.showToast({ title: '请至少开放一个时段', icon: 'none' });
      return;
    }

    storage.updateCounselorSchedule(counselorId, {
      days,
      slots,
      maxPerDay
    });

    wx.showToast({ title: '排班设置已更新', icon: 'success' });
    setTimeout(() => {
      wx.navigateBack();
    }, 1000);
  }
});
