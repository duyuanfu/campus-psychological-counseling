// pages/mine/mood-diary.js - 情绪日记
const storage = require('../../utils/storage');

Page({
  data: {
    moodLevels: [
      { score: 5, emoji: '😄', text: '开心' },
      { score: 4, emoji: '🙂', text: '良好' },
      { score: 3, emoji: '😐', text: '平静' },
      { score: 2, emoji: '🙁', text: '焦虑' },
      { score: 1, emoji: '😞', text: '低落' }
    ],
    currentScore: 4,
    content: '',
    diaries: []
  },

  onLoad() {
    this.loadDiaries();
  },

  loadDiaries() {
    const list = storage.getMoodDiaries();
    this.setData({ diaries: list });
  },

  selectScore(e) {
    this.setData({ currentScore: e.currentTarget.dataset.score });
  },

  onInputContent(e) {
    this.setData({ content: e.detail.value });
  },

  saveDiary() {
    const { currentScore, moodLevels, content } = this.data;
    const moodItem = moodLevels.find(m => m.score === currentScore) || moodLevels[1];

    storage.saveMoodDiary({
      moodScore: currentScore,
      moodIcon: moodItem.emoji,
      moodText: moodItem.text,
      content: content || '完成日常心情打卡'
    });

    wx.showToast({ title: '保存成功', icon: 'success' });
    this.setData({ content: '' });
    this.loadDiaries();
  }
});
