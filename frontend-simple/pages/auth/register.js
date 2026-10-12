// pages/auth/register.js - 注册逻辑
const app = getApp();
const storage = require('../../utils/storage');
const api = require('../../utils/api');

Page({
  data: {
    selectedRole: 'student',
    colleges: [
      '数字媒体学院',
      '计算机科学学院',
      '经济管理学院',
      '外国语学院',
      '机电工程学院'
    ],
    collegeIndex: 0,
    form: {
      username: '',
      password: '',
      name: '',
      phone: '',
      studentId: '',
      major: '数字媒体技术 大二',
      title: '专职心理咨询师',
      qualification: '国家二级心理咨询师',
      tags: '学业焦虑,人际关系',
      location: '心理中心 302室'
    }
  },

  onLoad(options) {
    if (options.role) {
      this.setData({ selectedRole: options.role });
    }
  },

  switchRole(e) {
    const role = e.currentTarget.dataset.role;
    this.setData({ selectedRole: role });
  },

  onCollegeChange(e) {
    this.setData({ collegeIndex: Number(e.detail.value) });
  },

  onInput(e) {
    const field = e.currentTarget.dataset.field;
    this.setData({ [`form.${field}`]: e.detail.value });
  },

  handleRegister() {
    const { form, selectedRole, colleges, collegeIndex } = this.data;

    if (!form.username || !form.password || !form.name || !form.phone) {
      wx.showToast({ title: '请填写完整信息', icon: 'none' });
      return;
    }

    if (selectedRole === 'student' && !form.studentId) {
      wx.showToast({ title: '请填写学号', icon: 'none' });
      return;
    }

    wx.showLoading({ title: '注册中...' });

    const payload = {
      role: selectedRole.toUpperCase(),
      username: form.username.trim(),
      password: form.password,
      name: form.name.trim(),
      phone: form.phone.trim(),
      studentId: form.studentId.trim(),
      college: colleges[collegeIndex],
      major: form.major,
      title: form.title,
      qualification: form.qualification,
      tags: form.tags,
      location: form.location
    };

    api.register(payload)
      .then((data) => {
        wx.hideLoading();
        wx.setStorageSync('xys_token', data.token);
        storage.setCurrentRole(selectedRole);
        storage.updateCurrentUser(data.user);

        app.globalData.currentRole = selectedRole;
        app.globalData.userInfo = data.user;

        wx.showToast({ title: '注册成功', icon: 'success' });
        this.redirectAfterRegister(selectedRole);
      })
      .catch((err) => {
        wx.hideLoading();
        // 本地降级
        storage.setCurrentRole(selectedRole);
        const newUser = {
          name: form.name,
          studentId: form.studentId || '2022030142',
          college: colleges[collegeIndex],
          phone: form.phone,
          isCertified: true
        };
        storage.updateCurrentUser(newUser);
        app.globalData.currentRole = selectedRole;
        app.globalData.userInfo = newUser;

        wx.showToast({ title: '注册成功(本地)', icon: 'success' });
        this.redirectAfterRegister(selectedRole);
      });
  },

  redirectAfterRegister(role) {
    setTimeout(() => {
      if (role === 'counselor') {
        wx.reLaunch({ url: '/pages/counselor/dashboard' });
      } else {
        wx.switchTab({ url: '/pages/index/index' });
      }
    }, 500);
  },

  navToLogin() {
    wx.navigateBack();
  }
});
