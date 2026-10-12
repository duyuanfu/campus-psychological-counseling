// pages/counselor/schedule.js - 排班
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
      '16:00 - 17:00'
    ],
    selectedSlotsMap: {},
    maxPerDay: 4
  },

  onLoad() {
    const user = storage.getCurrentUser();
    const id = user.id || 'c_2001';
    const s = storage.getCounselorSchedule(id);

    const daysMap = {};
    (s.days || ['周二', '周三', '周四', '周五']).forEach(d => daysMap[d] = true);

    const slotsMap = {};
    (s.slots || ['09:00 - 10:00', '14:30 - 15:30']).forEach(slot => slotsMap[slot] = true);

    this.setData({
      counselorId: id,
      selectedDaysMap: daysMap,
      selectedSlotsMap: slotsMap,
      maxPerDay: s.maxPerDay || 4
    });
  },

  onDaysChange(e) {
    const vals = e.detail.value;
    const map = {};
    vals.forEach(d => map[d] = true);
    this.setData({ selectedDaysMap: map });
  },

  onSlotsChange(e) {
    const vals = e.detail.value;
    const map = {};
    vals.forEach(s => map[s] = true);
    this.setData({ selectedSlotsMap: map });
  },

  onInputMax(e) {
    this.setData({ maxPerDay: Number(e.detail.value) || 4 });
  },

  saveSchedule() {
    const { counselorId, selectedDaysMap, selectedSlotsMap, maxPerDay } = this.data;
    const days = Object.keys(selectedDaysMap).filter(k => selectedDaysMap[k]);
    const slots = Object.keys(selectedSlotsMap).filter(k => selectedSlotsMap[k]);

    storage.updateCounselorSchedule(counselorId, {
      days,
      slots,
      maxPerDay
    });

    wx.showToast({ title: '排班已保存', icon: 'success' });
    setTimeout(() => {
      wx.navigateBack();
    }, 600);
  }
});
