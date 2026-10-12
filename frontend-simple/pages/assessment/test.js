// pages/assessment/test.js - 在线答题
const storage = require('../../utils/storage');

Page({
  data: {
    scaleId: 'sds',
    scale: {},
    totalCount: 20,
    currentIndex: 0,
    currentQuestion: {},
    answers: {},
    isLastQ: false
  },

  onLoad(options) {
    const scaleId = options.id || 'sds';
    const scale = storage.getScaleById(scaleId);

    this.setData({
      scaleId,
      scale,
      totalCount: scale.questions.length,
      currentIndex: 0,
      currentQuestion: scale.questions[0],
      answers: {},
      isLastQ: scale.questions.length <= 1
    });
  },

  selectOption(e) {
    const score = e.currentTarget.dataset.score;
    const { currentIndex, answers, totalCount } = this.data;

    answers[currentIndex] = score;
    this.setData({ answers });

    // 自动切到下一题
    if (currentIndex < totalCount - 1) {
      setTimeout(() => {
        this.goToQuestion(currentIndex + 1);
      }, 200);
    }
  },

  goToQuestion(idx) {
    this.setData({
      currentIndex: idx,
      currentQuestion: this.data.scale.questions[idx],
      isLastQ: idx >= this.data.totalCount - 1
    });
  },

  prevQ() {
    if (this.data.currentIndex > 0) {
      this.goToQuestion(this.data.currentIndex - 1);
    }
  },

  nextQ() {
    if (!this.data.answers[this.data.currentIndex]) {
      wx.showToast({ title: '请先选择答案', icon: 'none' });
      return;
    }
    if (this.data.currentIndex < this.data.totalCount - 1) {
      this.goToQuestion(this.data.currentIndex + 1);
    }
  },

  submitTest() {
    const { scale, answers, scaleId } = this.data;
    if (Object.keys(answers).length < scale.questions.length) {
      wx.showToast({ title: '还有题目未答完', icon: 'none' });
      return;
    }

    wx.showLoading({ title: '正在计分...' });

    setTimeout(() => {
      wx.hideLoading();
      const report = storage.evaluateScale(scaleId, answers);
      wx.redirectTo({
        url: `/pages/assessment/report?id=${report.id}`
      });
    }, 500);
  }
});
