// pages/appointment/index.js
const storage = require('../../utils/storage');

Page({
  data: {
    counselors: [],
    filteredCounselors: [],
    categories: ['全部专长', '学业焦虑', '情绪舒缓', '人际关系', '亲密关系', '生涯规划'],
    selectedCategory: '全部专长',
    pendingCount: 0
  },

  onShow() {
    this.loadData();
  },

  onPullDownRefresh() {
    this.loadData();
    wx.stopPullDownRefresh();
  },

  loadData() {
    const counselors = storage.getCounselors();
    const currentUser = storage.getCurrentUser();
    const myRecords = storage.getAppointments({ studentId: currentUser.id });
    const pendingCount = myRecords.filter(r => r.status === 'pending').length;

    this.setData({
      counselors,
      pendingCount
    });
    this.filterCounselors(this.data.selectedCategory);
  },

  selectCategory(e) {
    const cat = e.currentTarget.dataset.cat;
    this.setData({ selectedCategory: cat });
    this.filterCounselors(cat);
  },

  filterCounselors(category) {
    const list = this.data.counselors;
    if (category === '全部专长') {
      this.setData({ filteredCounselors: list });
    } else {
      const filtered = list.filter(c => c.tagList && c.tagList.includes(category));
      this.setData({ filteredCounselors: filtered });
    }
  },

  navToDetail(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({ url: `/pages/appointment/detail?id=${id}` });
  },

  navToBook(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({ url: `/pages/appointment/book?counselorId=${id}` });
  },

  navToMyRecords() {
    wx.navigateTo({ url: '/pages/appointment/my-records' });
  }
});
