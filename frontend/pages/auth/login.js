// pages/auth/login.js
const app = getApp();
const storage = require('../../utils/storage');
const api = require('../../utils/api');

Page({
  data: {
    selectedRole: 'student', // 'student' | 'counselor' | 'admin'
    username: '',
    password: '',
    showPassword: false
  },

  onLoad(options) {
    if (options.role) {
      this.setData({ selectedRole: options.role });
    }
    // 默认填入学生测试账号方便快速测试
    this.fillDefaultAccount();
  },

  switchRole(e) {
    const role = e.currentTarget.dataset.role;
    this.setData({ selectedRole: role }, () => {
      this.fillDefaultAccount();
    });
  },

  fillDefaultAccount() {
    const role = this.data.selectedRole;
    if (role === 'student') {
      this.setData({ username: 'student', password: '123456' });
    } else if (role === 'counselor') {
      this.setData({ username: 'counselor', password: '123456' });
    } else {
      this.setData({ username: 'admin', password: '123456' });
    }
  },

  onUsernameInput(e) { this.setData({ username: e.detail.value }); },
  onPasswordInput(e) { this.setData({ password: e.detail.value }); },
  toggleShowPassword() { this.setData({ showPassword: !this.data.showPassword }); },

  handleLogin() {
    const { username, password, selectedRole } = this.data;

    if (!username.trim()) {
      wx.showToast({ title: '请输入账号', icon: 'none' });
      return;
    }
    if (!password) {
      wx.showToast({ title: '请输入密码', icon: 'none' });
      return;
    }

    wx.showLoading({ title: '正在登录...' });

    // 优先调用 Java Spring Boot 后端
    api.login(username.trim(), password, selectedRole)
      .then((data) => {
        wx.hideLoading();
        wx.setStorageSync('xys_token', data.token);
        storage.setCurrentRole(selectedRole);
        storage.updateCurrentUser(data.user);

        app.globalData.currentRole = selectedRole;
        app.globalData.userInfo = data.user;

        wx.showToast({ title: '登录成功', icon: 'success' });
        this.redirectAfterLogin(selectedRole);
      })
      .catch((err) => {
        wx.hideLoading();
        if (err.message === 'NETWORK_OFFLINE') {
          // 本地离线模拟降级登录
          this.fallbackLocalLogin(username.trim(), password, selectedRole);
        } else {
          wx.showModal({
            title: '登录失败',
            content: err.message || '账号或密码不正确',
            showCancel: false
          });
        }
      });
  },

  fallbackLocalLogin(username, password, selectedRole) {
    storage.setCurrentRole(selectedRole);
    const user = storage.getCurrentUser();
    app.globalData.currentRole = selectedRole;
    app.globalData.userInfo = user;

    wx.showToast({ title: '登录成功', icon: 'success' });
    this.redirectAfterLogin(selectedRole);
  },

  redirectAfterLogin(role) {
    setTimeout(() => {
      if (role === 'counselor') {
        wx.reLaunch({ url: '/pages/counselor/dashboard' });
      } else if (role === 'admin') {
        wx.reLaunch({ url: '/pages/admin/dashboard' });
      } else {
        wx.switchTab({ url: '/pages/index/index' });
      }
    }, 600);
  },

  navToRegister() {
    wx.navigateTo({
      url: `/pages/auth/register?role=${this.data.selectedRole}`
    });
  }
});
