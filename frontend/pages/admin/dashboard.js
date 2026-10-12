// pages/admin/dashboard.js
const app = getApp();
const storage = require('../../utils/storage');

Page({
  data: {
    admin: {},
    pendingUserAudits: 1,
    articlesCount: 0,
    postsCount: 0,
    crisisCount: 0
  },

  onShow() {
    this.loadAdminData();
  },

  onPullDownRefresh() {
    this.loadAdminData();
    wx.stopPullDownRefresh();
  },

  loadAdminData() {
    const admin = storage.getCurrentUser();
    const articles = storage.getArticles();
    const posts = storage.getTreeholePosts();
    const alerts = storage.getCrisisAlerts().filter(a => a.status !== 'resolved');

    this.setData({
      admin,
      pendingUserAudits: 2,
      articlesCount: articles.length,
      postsCount: posts.length,
      crisisCount: alerts.length
    });
  },

  navToUserAudit() {
    wx.navigateTo({ url: '/pages/admin/user-audit' });
  },

  navToArticleManage() {
    wx.navigateTo({ url: '/pages/admin/article-manage' });
  },

  navToTreeholeAudit() {
    wx.navigateTo({ url: '/pages/admin/treehole-audit' });
  },

  navToAnalytics() {
    wx.navigateTo({ url: '/pages/admin/analytics' });
  },

  handleLogout() {
    wx.showModal({
      title: '退出登录',
      content: '确认退出当前管理员账号？',
      confirmColor: '#F5222D',
      success: (res) => {
        if (res.confirm) {
          wx.removeStorageSync('xys_token');
          wx.reLaunch({ url: '/pages/auth/login' });
        }
      }
    });
  }
});
