// pages/index/index.js
const app = getApp();
const storage = require('../../utils/storage');

Page({
  data: {
    currentRole: 'student',
    currentRoleName: '学生端',
    userInfo: {},
    counselors: [],
    articles: [],
    selectedMoodScore: 0,
    moodIcons: [
      { score: 5, emoji: '✨', label: '元气满满' },
      { score: 4, emoji: '😊', label: '平静舒缓' },
      { score: 3, emoji: '😐', label: '平淡放空' },
      { score: 2, emoji: '🌧️', label: '稍有焦虑' },
      { score: 1, emoji: '💔', label: '情绪低落' }
    ]
  },

  onShow() {
    this.refreshPageData();
  },

  onPullDownRefresh() {
    this.refreshPageData();
    wx.stopPullDownRefresh();
  },

  refreshPageData() {
    const role = storage.getCurrentRole();
    const roleMap = {
      student: '学生端 (学生身份)',
      counselor: '咨询师端 (导师工作台)',
      admin: '管理员端 (后台看板)'
    };
    const user = storage.getCurrentUser();
    const counselors = storage.getCounselors();
    const articles = storage.getArticles();

    this.setData({
      currentRole: role,
      currentRoleName: roleMap[role] || '学生端',
      userInfo: user,
      counselors: counselors.slice(0, 2),
      articles: articles.slice(0, 2)
    });
  },

  // 快捷情绪打卡
  quickCheckInMood(e) {
    const item = e.currentTarget.dataset.item;
    this.setData({ selectedMoodScore: item.score });

    storage.saveMoodDiary({
      moodScore: item.score,
      moodIcon: item.emoji,
      moodText: item.label,
      tags: ['首页一键打卡'],
      content: `今天在首页完成心晴记录：${item.label}`
    });

    wx.showToast({
      title: `打卡成功: ${item.label}`,
      icon: 'success'
    });
  },

  // 导航方法
  navToMoodDiary() {
    wx.navigateTo({ url: '/pages/mine/mood-diary' });
  },
  navToRelax(e) {
    const tab = e.currentTarget.dataset.tab || 'breath';
    wx.navigateTo({ url: `/pages/relax/relax?tab=${tab}` });
  },
  navToAppointment() {
    wx.switchTab({ url: '/pages/appointment/index' });
  },
  navToAssessment(e) {
    const id = e.currentTarget.dataset.id || 'sds';
    wx.navigateTo({ url: `/pages/assessment/test?id=${id}` });
  },
  navToTreehole() {
    wx.switchTab({ url: '/pages/treehole/index' });
  },
  navToCounselorDetail(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({ url: `/pages/appointment/detail?id=${id}` });
  },
  quickBook(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({ url: `/pages/appointment/book?counselorId=${id}` });
  },
  navToArticle(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({ url: `/pages/relax/article?id=${id}` });
  },
  callEmergencyLine() {
    wx.makePhoneCall({
      phoneNumber: '400-161-9995',
      fail() {
        wx.showToast({ title: '已模拟热线呼叫', icon: 'none' });
      }
    });
  }
});
