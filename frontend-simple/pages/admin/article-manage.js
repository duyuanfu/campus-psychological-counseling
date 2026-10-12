// pages/admin/article-manage.js - 文章管理
const storage = require('../../utils/storage');

Page({
  data: {
    articles: [],
    showModal: false,
    form: {
      title: '',
      author: '心理中心',
      summary: '',
      content: ''
    }
  },

  onShow() {
    this.loadData();
  },

  loadData() {
    this.setData({ articles: storage.getArticles() });
  },

  openAddModal() {
    this.setData({
      showModal: true,
      form: { title: '', author: '心理中心', summary: '', content: '' }
    });
  },

  closeModal() {
    this.setData({ showModal: false });
  },

  onInput(e) {
    const field = e.currentTarget.dataset.field;
    this.setData({ [`form.${field}`]: e.detail.value });
  },

  submitArticle() {
    const { form } = this.data;
    if (!form.title.trim()) {
      wx.showToast({ title: '请输入标题', icon: 'none' });
      return;
    }

    storage.saveArticle({
      title: form.title.trim(),
      category: '心理科普',
      author: form.author.trim() || '心理中心',
      summary: form.summary.trim() || form.title,
      content: form.content ? form.content.split('\n') : [form.summary]
    });

    wx.showToast({ title: '发布成功', icon: 'success' });
    this.closeModal();
    this.loadData();
  },

  deleteArt(e) {
    const id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '确认删除',
      content: '确定要删除该篇文章吗？',
      success: (res) => {
        if (res.confirm) {
          storage.deleteArticle(id);
          wx.showToast({ title: '已删除', icon: 'success' });
          this.loadData();
        }
      }
    });
  }
});
