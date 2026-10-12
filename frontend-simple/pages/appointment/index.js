// pages/appointment/index.js - 预约列表
const storage = require('../../utils/storage');

Page({
  data: {
    categories: ['全部', '学业焦虑', '情绪舒缓', '人际关系'],
    selectedCat: '全部',
    allCounselors: [],
    filteredList: []
  },

  onShow() {
    this.loadData();
  },

  onPullDownRefresh() {
    this.loadData();
    wx.stopPullDownRefresh();
  },

  loadData() {
    const list = storage.getCounselors();
    this.setData({ allCounselors: list });
    this.filterList(this.data.selectedCat);
  },

  selectCategory(e) {
    const cat = e.currentTarget.dataset.cat;
    this.setData({ selectedCat: cat });
    this.filterList(cat);
  },

  filterList(cat) {
    const all = this.data.allCounselors;
    if (cat === '全部') {
      this.setData({ filteredList: all });
    } else {
      this.setData({ filteredList: all.filter(c => c.tagList && c.tagList.includes(cat)) });
    }
  },

  navToDetail(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/appointment/detail?id=${id}`
    });
  },

  navToBook(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/appointment/book?counselorId=${id}`
    });
  },

  navToRecords() {
    wx.navigateTo({
      url: '/pages/appointment/my-records'
    });
  }
});
