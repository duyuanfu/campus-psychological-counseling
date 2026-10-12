// pages/admin/treehole-audit.js
const storage = require('../../utils/storage');

Page({
  data: {
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
    const list = storage.getTreeholePosts();
    this.setData({ posts: list });
  },

  removePost(e) {
    const id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '确认下架违规内容？',
      content: '下架后该贴将从树洞广场彻底清除，保障社区健康。',
      confirmColor: '#F5222D',
      success: (res) => {
        if (res.confirm) {
          storage.auditTreeholePost(id, 'delete');
          wx.showToast({ title: '已违规下架', icon: 'success' });
          this.loadPosts();
        }
      }
    });
  },

  approvePost(e) {
    const id = e.currentTarget.dataset.id;
    storage.auditTreeholePost(id, 'pass');
    wx.showToast({ title: '审核已通过', icon: 'success' });
    this.loadPosts();
  },

  escalateCrisis(e) {
    const item = e.currentTarget.dataset.item;
    storage.triggerCrisisAlert({
      level: 'yellow',
      levelName: '中度预警 (管理员树洞筛查触发)',
      triggerReason: `管理员审核发现疑似心理困扰：“${item.content.slice(0, 30)}...”`,
      scaleScore: 65
    });

    wx.showToast({ title: '已同步至危机干预专区', icon: 'success' });
  }
});
