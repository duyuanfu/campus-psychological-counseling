// pages/auth/register.js
const app = getApp();
const storage = require('../../utils/storage');
const api = require('../../utils/api');

Page({
  data: {
    selectedRole: 'student', // 'student' | 'counselor'
    colleges: [
      '数字媒体与设计学院',
      '计算机科学与技术学院',
      '经济管理学院',
      '外国语学院',
      '机械与电气工程学院',
      '人文与法学院'
    ],
    collegeIndex: 0,
    form: {
      username: '',
      password: '',
      confirmPassword: '',
      name: '',
      phone: '',

      // 学生字段
      studentId: '',
      college: '数字媒体与设计学院',
      major: '数字媒体艺术',
      grade: '大二',
      emergencyContact: '',
      emergencyPhone: '',

      // 咨询师字段
      title: '副教授 / 注册心理师',
      qualification: '国家二级心理咨询师 (No.1802000045)',
      experience: '8年高校心理咨询经验',
      tags: '学业焦虑,人际关系,情绪舒缓',
      intro: '倾听与接纳每一位青年心灵，发掘内在韧性。',
      location: '阳光校区 心理健康中心 302室'
    }
  },

  onLoad(options) {
    if (options.role && (options.role === 'student' || options.role === 'counselor')) {
      this.setData({ selectedRole: options.role });
    }
  },

  switchRole(e) {
    const role = e.currentTarget.dataset.role;
    this.setData({ selectedRole: role });
  },

  onCollegeChange(e) {
    const idx = Number(e.detail.value);
    this.setData({
      collegeIndex: idx,
      'form.college': this.data.colleges[idx]
    });
  },

  onInput(e) {
    const field = e.currentTarget.dataset.field;
    this.setData({ [`form.${field}`]: e.detail.value });
  },

  handleRegister() {
    const { form, selectedRole } = this.data;

    // 表单基础校验
    if (!form.username.trim()) {
      wx.showToast({ title: '请输入登录账号', icon: 'none' });
      return;
    }
    if (!form.password || form.password.length < 6) {
      wx.showToast({ title: '密码不能少于6位', icon: 'none' });
      return;
    }
    if (form.password !== form.confirmPassword) {
      wx.showToast({ title: '两次输入的密码不一致', icon: 'none' });
      return;
    }
    if (!form.name.trim()) {
      wx.showToast({ title: '请输入真实姓名', icon: 'none' });
      return;
    }
    if (!form.phone.trim()) {
      wx.showToast({ title: '请输入联系手机号', icon: 'none' });
      return;
    }

    if (selectedRole === 'student' && !form.studentId.trim()) {
      wx.showToast({ title: '请输入在校学号', icon: 'none' });
      return;
    }

    if (selectedRole === 'counselor' && !form.qualification.trim()) {
      wx.showToast({ title: '请输入执业资质编号', icon: 'none' });
      return;
    }

    wx.showLoading({ title: '正在注册提交...' });

    const payload = {
      role: selectedRole.toUpperCase(),
      username: form.username.trim(),
      password: form.password,
      name: form.name.trim(),
      phone: form.phone.trim(),

      studentId: form.studentId.trim(),
      college: form.college,
      major: form.major,
      grade: form.grade,
      emergencyContact: form.emergencyContact,
      emergencyPhone: form.emergencyPhone,

      title: form.title,
      qualification: form.qualification,
      experience: form.experience,
      tags: form.tags,
      intro: form.intro,
      location: form.location
    };

    api.register(payload)
      .then((data) => {
        wx.hideLoading();
        // 保存 Token 与登录状态
        wx.setStorageSync('xys_token', data.token);
        storage.setCurrentRole(selectedRole);
        storage.updateCurrentUser(data.user);

        app.globalData.currentRole = selectedRole;
        app.globalData.userInfo = data.user;

        wx.showToast({ title: '注册成功并已登录', icon: 'success' });
        this.redirectAfterRegister(selectedRole);
      })
      .catch((err) => {
        wx.hideLoading();
        if (err.message === 'NETWORK_OFFLINE') {
          // 本地无缝降级注册
          this.fallbackLocalRegister(payload, selectedRole);
        } else {
          wx.showModal({
            title: '注册提示',
            content: err.message || '注册未能完成，请稍后重试',
            showCancel: false
          });
        }
      });
  },

  // 后端离线时的本地模拟注册
  fallbackLocalRegister(payload, selectedRole) {
    storage.setCurrentRole(selectedRole);

    let newUser = {};
    if (selectedRole === 'student') {
      newUser = {
        name: payload.name,
        studentId: payload.studentId,
        college: payload.college,
        major: payload.major,
        grade: payload.grade,
        phone: payload.phone,
        isCertified: true
      };
    } else {
      newUser = {
        name: payload.name,
        title: payload.title,
        qualification: payload.qualification,
        college: '学生心理健康中心',
        phone: payload.phone,
        isCertified: true,
        tags: payload.tags ? payload.tags.split(',') : ['学业焦虑', '情绪舒缓']
      };
    }

    storage.updateCurrentUser(newUser);
    app.globalData.currentRole = selectedRole;
    app.globalData.userInfo = newUser;

    wx.showToast({ title: '注册成功 (本地模拟)', icon: 'success' });
    this.redirectAfterRegister(selectedRole);
  },

  redirectAfterRegister(role) {
    setTimeout(() => {
      if (role === 'counselor') {
        wx.reLaunch({ url: '/pages/counselor/dashboard' });
      } else {
        wx.switchTab({ url: '/pages/index/index' });
      }
    }, 600);
  },

  navToLogin() {
    wx.navigateBack();
  }
});
