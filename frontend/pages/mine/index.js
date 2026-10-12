// pages/mine/index.js
const app = getApp();
const storage = require('../../utils/storage');

Page({
  data: {
    currentRole: 'student',
    currentRoleName: '学生端',
    userInfo: {},
    stats: {
      aptCount: 0,
      reportCount: 0,
      diaryCount: 0
    }
  },

  onShow() {
    this.refreshUserData();
  },

  onPullDownRefresh() {
    this.refreshUserData();
    wx.stopPullDownRefresh();
  },

  refreshUserData() {
    const role = storage.getCurrentRole();
    const roleMap = {
      student: '学生端 (学生身份)',
      counselor: '咨询师端 (导师工作台)',
      admin: '管理员端 (后台看板)'
    };
    const userInfo = storage.getCurrentUser();
    const apts = storage.getAppointments({ studentId: userInfo.id });
    const reports = storage.getAssessmentHistory();
    const diaries = storage.getMoodDiaries();

    this.setData({
      currentRole: role,
      currentRoleName: roleMap[role] || '学生端',
      userInfo,
      stats: {
        aptCount: apts.length,
        reportCount: reports.length,
        diaryCount: diaries.length
      }
    });
  },

  navToAuth() {
    wx.navigateTo({ url: '/pages/mine/auth' });
  },

  navToMoodDiary() {
    wx.navigateTo({ url: '/pages/mine/mood-diary' });
  },

  navToPrivacy() {
    wx.navigateTo({ url: '/pages/mine/privacy' });
  },

  navToAppointments() {
    wx.navigateTo({ url: '/pages/appointment/my-records' });
  },

  navToAssessments() {
    wx.switchTab({ url: '/pages/assessment/index' });
  },

  navToCounselorDashboard() {
    wx.navigateTo({ url: '/pages/counselor/dashboard' });
  },

  navToAdminDashboard() {
    wx.navigateTo({ url: '/pages/admin/dashboard' });
  },

  callHotline() {
    wx.makePhoneCall({
      phoneNumber: '010-88886666',
      fail() {
        wx.showToast({ title: '已模拟热线拨打', icon: 'none' });
      }
    });
  },

  navToLogin() {
    wx.navigateTo({ url: `/pages/auth/login?role=${this.data.currentRole}` });
  },

  navToRegister() {
    wx.navigateTo({ url: `/pages/auth/register?role=${this.data.currentRole}` });
  },

  handleLogout() {
    wx.showModal({
      title: '提示',
      content: '确认退出登录？',
      confirmText: '退出',
      confirmColor: '#DC2626',
      success: (res) => {
        if (res.confirm) {
          wx.removeStorageSync('xys_token');
          wx.reLaunch({ url: '/pages/auth/login' });
        }
      }
    });
  }
});
