// app.js
const storage = require('./utils/storage');

App({
  onLaunch() {
    // 1. 初始化本地持久化数据库与Mock数据
    storage.init();

    // 2. 获取当前角色与用户信息
    this.globalData.currentRole = storage.getCurrentRole();
    this.globalData.userInfo = storage.getCurrentUser();
  },

  globalData: {
    currentRole: 'student', // 'student' | 'counselor' | 'admin'
    userInfo: null,
    // 呼吸训练全局状态
    breathingActive: false,
    // 白噪音音频上下文管理
    currentSound: null,
    soundAudioCtx: null
  },

  // 角色切换方法
  switchRole(newRole) {
    storage.setCurrentRole(newRole);
    this.globalData.currentRole = newRole;
    this.globalData.userInfo = storage.getCurrentUser();
    
    wx.showToast({
      title: `已切换至【${newRole === 'student' ? '学生端' : (newRole === 'counselor' ? '咨询师端' : '管理员端')}】`,
      icon: 'success',
      duration: 1500
    });
  }
});
