// pages/treehole/post.js - 发帖
const storage = require('../../utils/storage');

Page({
  data: {
    tags: ['学业困惑', '人际关系', '情感树洞', '求助'],
    selectedTag: '学业困惑',
    content: ''
  },

  onTagChange(e) {
    this.setData({ selectedTag: e.detail.value });
  },

  onInputContent(e) {
    this.setData({ content: e.detail.value });
  },

  submitPost() {
    const { content, selectedTag } = this.data;
    if (!content.trim()) {
      wx.showToast({ title: '请输入内容', icon: 'none' });
      return;
    }

    storage.createTreeholePost({
      tag: selectedTag,
      content: content.trim()
    });

    wx.showToast({ title: '发帖成功', icon: 'success' });
    setTimeout(() => {
      wx.navigateBack();
    }, 600);
  }
});
