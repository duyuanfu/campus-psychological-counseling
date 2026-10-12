// pages/assessment/test.js
const storage = require('../../utils/storage');

Page({
  data: {
    scaleId: 'sds',
    scale: {},
    totalQuestions: 20,
    currentIndex: 0,
    currentQuestion: null,
    answers: {},
    progressPercent: 5,
    isLastQuestion: false
  },

  onLoad(options) {
    const scaleId = options.id || 'sds';
    const scale = storage.getScaleById(scaleId);

    this.setData({
      scaleId,
      scale,
      totalQuestions: scale.questions.length,
      currentIndex: 0,
      currentQuestion: scale.questions[0],
      answers: {},
      progressPercent: Math.round((1 / scale.questions.length) * 100),
      isLastQuestion: scale.questions.length <= 1
    });
  },

  onSelectOption(e) {
    const score = e.currentTarget.dataset.score;
    const { currentIndex, answers, scale } = this.data;

    answers[currentIndex] = score;
    this.setData({ answers });

    // 触觉轻微震动反馈
    wx.vibrateShort && wx.vibrateShort({ type: 'light' });

    // 延时250ms自动下一题
    if (currentIndex < scale.questions.length - 1) {
      setTimeout(() => {
        this.goToQuestion(currentIndex + 1);
      }, 250);
    }
  },

  goToQuestion(idx) {
    const { scale } = this.data;
    const progressPercent = Math.round(((idx + 1) / scale.questions.length) * 100);
    this.setData({
      currentIndex: idx,
      currentQuestion: scale.questions[idx],
      progressPercent,
      isLastQuestion: idx >= scale.questions.length - 1
    });
  },

  prevQuestion() {
    if (this.data.currentIndex > 0) {
      this.goToQuestion(this.data.currentIndex - 1);
    }
  },

  nextQuestion() {
    const { currentIndex, scale, answers } = this.data;
    if (!answers[currentIndex]) {
      wx.showToast({ title: '请先完成本题作答', icon: 'none' });
      return;
    }
    if (currentIndex < scale.questions.length - 1) {
      this.goToQuestion(currentIndex + 1);
    }
  },

  submitTest() {
    const { scale, answers, scaleId } = this.data;
    const answeredCount = Object.keys(answers).length;

    if (answeredCount < scale.questions.length) {
      wx.showToast({
        title: `还剩 ${scale.questions.length - answeredCount} 题未作答`,
        icon: 'none'
      });
      return;
    }

    wx.showLoading({ title: 'AI智能多维计分中...' });

    setTimeout(() => {
      wx.hideLoading();
      // 调用量表专业评估算法
      const report = storage.evaluateScale(scaleId, answers);

      wx.redirectTo({
        url: `/pages/assessment/report?id=${report.id}`
      });
    }, 800);
  }
});
