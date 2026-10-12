// pages/treehole/detail.js
const storage = require('../../utils/storage');

Page({
  data: {
    postId: '',
    post: null,
    inputComment: ''
  },

  onLoad(options) {
    const postId = options.id;
    this.setData({ postId });
    this.loadPost(postId);
  },

  loadPost(id) {
    const post = storage.getTreeholePostById(id);
    this.setData({ post });
  },

  toggleHug() {
    storage.toggleTreeholeHug(this.data.postId);
    this.loadPost(this.data.postId);
    wx.vibrateShort && wx.vibrateShort({ type: 'light' });
  },

  onInputComment(e) {
    this.setData({ inputComment: e.detail.value });
  },

  submitComment() {
    const text = this.data.inputComment.trim();
    if (!text) {
      wx.showToast({ title: '评论内容不能为空', icon: 'none' });
      return;
    }

    storage.addTreeholeComment(this.data.postId, text);
    this.setData({ inputComment: '' });
    this.loadPost(this.data.postId);
    wx.showToast({ title: '已送出回音', icon: 'success' });
  }
});
