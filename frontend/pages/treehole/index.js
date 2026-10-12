// pages/treehole/index.js
const storage = require('../../utils/storage');

Page({
  data: {
    categories: ['全部话题', '学业困惑', '人际关系', '情感树洞', '求助求抱抱', '心情碎碎念'],
    currentCategory: '全部话题',
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
    this.filterPosts(this.data.currentCategory);
  },

  selectCategory(e) {
    const cat = e.currentTarget.dataset.cat;
    this.setData({ currentCategory: cat });
    this.filterPosts(cat);
  },

  filterPosts(category) {
    const all = this.data.allPosts;
    if (category === '全部话题') {
      this.setData({ posts: all });
    } else {
      this.setData({ posts: all.filter(p => p.tag === category) });
    }
  },

  onHugPost(e) {
    const id = e.currentTarget.dataset.id;
    storage.toggleTreeholeHug(id);
    this.loadPosts();
    wx.vibrateShort && wx.vibrateShort({ type: 'light' });
  },

  navToDetail(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({ url: `/pages/treehole/detail?id=${id}` });
  },

  navToPost() {
    wx.navigateTo({ url: '/pages/treehole/post' });
  },

  reportPost() {
    wx.showActionSheet({
      itemList: ['涉嫌不当或违规言论', '涉及人身攻击', '涉及严重心理危机倾向'],
      success: () => {
        wx.showToast({ title: '已收到举报，管理员将及时审核', icon: 'success' });
      }
    });
  }
});
