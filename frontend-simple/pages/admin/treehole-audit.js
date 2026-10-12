// pages/admin/treehole-audit.js - 树洞审核
const storage = require('../../utils/storage');

Page({
  data: {
    posts: []
  },

  onShow() {
    this.loadPosts();
  },

  loadPosts() {
    this.setData({ posts: storage.getTreeholePosts() });
  },

  deletePost(e) {
    const id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '确认下架',
      content: '确定要下架并删除该条发帖吗？',
      success: (res) => {
        if (res.confirm) {
          storage.auditTreeholePost(id, 'delete');
          wx.showToast({ title: '已下架', icon: 'success' });
          this.loadPosts();
        }
      }
    });
  }
});
