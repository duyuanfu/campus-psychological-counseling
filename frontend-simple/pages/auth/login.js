// pages/auth/login.js - 登录逻辑
const app = getApp();
const storage = require('../../utils/storage');
const api = require('../../utils/api');

Page({
  data: {
    selectedRole: 'student',
    username: 'student',
    password: '123456'
  },

  onLoad(options) {
    if (options.role) {
      this.setData({ selectedRole: options.role });
    }
  },

  switchRole(e) {
    const role = e.currentTarget.dataset.role;
    this.setData({ selectedRole: role }, () => {
      this.fillDefault();
    });
  },

  fillDefault() {
    const role = this.data.selectedRole;
    if (role === 'student') {
      this.setData({ username: 'student', password: '123456' });
    } else if (role === 'counselor') {
      this.setData({ username: 'counselor', password: '123456' });
    } else {
      this.setData({ username: 'admin', password: '123456' });
    }
  },

  onInput(e) {
    const field = e.currentTarget.dataset.field;
    this.setData({ [field]: e.detail.value });
  },

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

    wx.showLoading({ title: '登录中...' });

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
        // 本地降级
        storage.setCurrentRole(selectedRole);
        const user = storage.getCurrentUser();
        app.globalData.currentRole = selectedRole;
        app.globalData.userInfo = user;

        wx.showToast({ title: '登录成功(本地)', icon: 'success' });
        this.redirectAfterLogin(selectedRole);
      });
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
    }, 500);
  },

  navToRegister() {
    wx.navigateTo({
      url: `/pages/auth/register?role=${this.data.selectedRole}`
    });
  }
});
