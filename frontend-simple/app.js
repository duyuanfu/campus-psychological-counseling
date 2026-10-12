// app.js - 校园心理咨询小程序 (课程设计版)
const storage = require('./utils/storage');

App({
  onLaunch() {
    // 初始化本地存储数据
    storage.init();
    this.globalData.currentRole = storage.getCurrentRole();
    this.globalData.userInfo = storage.getCurrentUser();
  },

  globalData: {
    currentRole: 'student',
    userInfo: null
  }
});
