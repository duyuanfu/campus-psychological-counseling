/**
 * 后端 Java RESTful API 网络请求封装
 * 默认服务地址：http://localhost:8080/api
 * 具备自动附加 Token、统一响应解包以及后端离线时的智能本地存储降级机制
 */
const storage = require('./storage');

const BASE_URL = 'http://127.0.0.1:8088/api';

const Api = {
  // 通用 request 基础方法
  request(options) {
    const token = wx.getStorageSync('xys_token') || '';
    const header = {
      'Content-Type': 'application/json',
      ...options.header
    };
    if (token) {
      header['Authorization'] = 'Bearer ' + token;
    }

    return new Promise((resolve, reject) => {
      wx.request({
        url: BASE_URL + options.url,
        method: options.method || 'GET',
        data: options.data,
        header,
        timeout: 4000,
        success: (res) => {
          if (res.statusCode === 200 && res.data.code === 200) {
            resolve(res.data.data);
          } else if (res.statusCode === 401) {
            wx.removeStorageSync('xys_token');
            reject(new Error(res.data.message || '登录已过期，请重新登录'));
          } else {
            reject(new Error(res.data.message || '请求失败'));
          }
        },
        fail: (err) => {
          // 后端离线或网络故障时返回特定错误，由业务层降级到本地模拟存储
          reject(new Error('NETWORK_OFFLINE'));
        }
      });
    });
  },

  // 1. 用户登录
  login(username, password, role) {
    return this.request({
      url: '/auth/login',
      method: 'POST',
      data: { username, password, role }
    });
  },

  // 2. 用户注册 (学生 / 咨询师)
  register(registerData) {
    return this.request({
      url: '/auth/register',
      method: 'POST',
      data: registerData
    });
  },

  // 3. 获取个人资料
  getProfile() {
    return this.request({
      url: '/auth/profile',
      method: 'GET'
    });
  },

  // 4. 咨询师列表
  getCounselors() {
    return this.request({
      url: '/counselors',
      method: 'GET'
    });
  },

  // 5. 提交预约
  createAppointment(aptData) {
    return this.request({
      url: '/appointments',
      method: 'POST',
      data: aptData
    });
  },

  // 6. 获取我的预约
  getMyAppointments() {
    return this.request({
      url: '/appointments/my',
      method: 'GET'
    });
  },

  // 7. 提交量表测评
  submitAssessment(scaleId, answers) {
    return this.request({
      url: '/assessment/submit',
      method: 'POST',
      data: { scaleId, answers }
    });
  },

  // 8. 树洞发帖
  createTreeholePost(postData) {
    return this.request({
      url: '/treehole/posts',
      method: 'POST',
      data: postData
    });
  },

  // 9. 获取树洞贴子
  getTreeholePosts(tag) {
    return this.request({
      url: '/treehole/posts' + (tag ? `?tag=${encodeURIComponent(tag)}` : ''),
      method: 'GET'
    });
  }
};

module.exports = Api;
