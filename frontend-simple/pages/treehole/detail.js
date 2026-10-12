// pages/treehole/detail.js - 树洞详情
const storage = require('../../utils/storage');

Page({
  data: {
    postId: '',
    post: {},
    commentText: ''
  },

  onLoad(options) {
    const id = options.id;
    this.setData({ postId: id });
    this.loadPost(id);
  },

  loadPost(id) {
    const p = storage.getTreeholePostById(id);
    this.setData({ post: p || {} });
  },

  onInput(e) {
    this.setData({ commentText: e.detail.value });
  },

  submitComment() {
    const { postId, commentText } = this.data;
    if (!commentText.trim()) {
      wx.showToast({ title: '请输入评论', icon: 'none' });
      return;
    }

    storage.addTreeholeComment(postId, commentText.trim());
    this.setData({ commentText: '' });
    this.loadPost(postId);
    wx.showToast({ title: '已回复', icon: 'success' });
  }
});
