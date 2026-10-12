// pages/treehole/index.js - 树洞列表
const storage = require('../../utils/storage');

Page({
  data: {
    categories: ['全部', '学业困惑', '人际关系', '情感树洞', '求助'],
    selectedCat: '全部',
    allPosts: [],
    posts: []
  },

  onShow() {
    this.loadPosts();
  },

  onPullDownRefresh() {
    this.loadPosts();
    wx.stopPullDownRefresh();
  },

  loadPosts() {
    const all = storage.getTreeholePosts();
    this.setData({ allPosts: all });
    this.filterPosts(this.data.selectedCat);
  },

  selectCat(e) {
    const cat = e.currentTarget.dataset.cat;
    this.setData({ selectedCat: cat });
    this.filterPosts(cat);
  },

  filterPosts(cat) {
    const all = this.data.allPosts;
    if (cat === '全部') {
      this.setData({ posts: all });
    } else {
      this.setData({ posts: all.filter(p => p.tag === cat) });
    }
  },

  hugPost(e) {
    const id = e.currentTarget.dataset.id;
    storage.toggleTreeholeHug(id);
    this.loadPosts();
    wx.showToast({ title: '已抱抱', icon: 'success' });
  },

  navToPost() {
    wx.navigateTo({ url: '/pages/treehole/post' });
  },

  navToDetail(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({ url: `/pages/treehole/detail?id=${id}` });
  }
});
