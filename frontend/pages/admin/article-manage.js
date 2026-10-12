// pages/admin/article-manage.js
const storage = require('../../utils/storage');

Page({
  data: {
    articles: [],
    showCreateModal: false,
    categories: ['学业与成长', '人际沟通', '情绪调节', '自我觉察', '恋爱心理'],
    catIndex: 0,
    form: {
      title: '',
      author: '学生心理中心',
      cover: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=500',
      summary: '',
      content: ''
    }
  },

  onShow() {
    this.loadArticles();
  },

  onPullDownRefresh() {
    this.loadArticles();
    wx.stopPullDownRefresh();
  },

  loadArticles() {
    const list = storage.getArticles();
    this.setData({ articles: list });
  },

  openCreateModal() {
    this.setData({
      showCreateModal: true,
      form: {
        title: '',
        author: '学生心理中心',
        cover: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=500',
        summary: '',
        content: ''
      }
    });
  },

  closeModal() {
    this.setData({ showCreateModal: false });
  },

  onCatChange(e) {
    this.setData({ catIndex: Number(e.detail.value) });
  },

  onInput(e) {
    const field = e.currentTarget.dataset.field;
    this.setData({ [`form.${field}`]: e.detail.value });
  },

  submitArticle() {
    const { form, categories, catIndex } = this.data;
    if (!form.title.trim()) {
      wx.showToast({ title: '请输入文章标题', icon: 'none' });
      return;
    }
    if (!form.summary.trim()) {
      wx.showToast({ title: '请输入导语摘要', icon: 'none' });
      return;
    }

    const paragraphs = form.content ? form.content.split('\n').filter(p => p.trim()) : [form.summary];

    storage.saveArticle({
      title: form.title.trim(),
      category: categories[catIndex],
      cover: form.cover || 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=500',
      author: form.author.trim() || '学生心理健康中心',
      summary: form.summary.trim(),
      content: paragraphs
    });

    wx.showToast({ title: '推文已发布上线', icon: 'success' });
    this.closeModal();
    this.loadArticles();
  },

  deleteArticle(e) {
    const id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '确认下架删除？',
      content: '删除后全校师生将无法再查看该篇科普推文。',
      confirmColor: '#F5222D',
      success: (res) => {
        if (res.confirm) {
          storage.deleteArticle(id);
          wx.showToast({ title: '已删除文章', icon: 'success' });
          this.loadArticles();
        }
      }
    });
  },

  previewArticle(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({ url: `/pages/relax/article?id=${id}` });
  }
});
