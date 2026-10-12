// pages/mine/mood-diary.js
const storage = require('../../utils/storage');

Page({
  data: {
    moodLevels: [
      { score: 5, emoji: '✨', text: '充满能量' },
      { score: 4, emoji: '😊', text: '平静舒心' },
      { score: 3, emoji: '😐', text: '平淡放空' },
      { score: 2, emoji: '🌧️', text: '有些焦虑' },
      { score: 1, emoji: '💔', text: '情绪低落' }
    ],
    currentScore: 4,
    currentMoodItem: null,
    presetTags: ['完成学业任务', '操场运动', '朋友倾听', '睡眠充足', 'DDL压力', '独处放空', '好天气'],
    selectedTagsMap: {},
    diaryText: '',
    diaries: []
  },

  onLoad() {
    this.setData({ currentMoodItem: this.data.moodLevels[1] });
    this.loadDiaries();
  },

  loadDiaries() {
    const list = storage.getMoodDiaries();
    this.setData({ diaries: list });
  },

  selectMoodScore(e) {
    const item = e.currentTarget.dataset.item;
    this.setData({
      currentScore: item.score,
      currentMoodItem: item
    });
  },

  toggleTag(e) {
    const tag = e.currentTarget.dataset.tag;
    const map = { ...this.data.selectedTagsMap };
    map[tag] = !map[tag];
    this.setData({ selectedTagsMap: map });
  },

  onInputText(e) {
    this.setData({ diaryText: e.detail.value });
  },

  saveDiary() {
    const { currentScore, currentMoodItem, selectedTagsMap, diaryText } = this.data;
    const chosenTags = Object.keys(selectedTagsMap).filter(t => selectedTagsMap[t]);

    storage.saveMoodDiary({
      moodScore: currentScore,
      moodIcon: currentMoodItem.emoji,
      moodText: currentMoodItem.text,
      tags: chosenTags.length > 0 ? chosenTags : ['日常自省'],
      content: diaryText || '今天完成了情绪记录，平稳度过了充实的一天。'
    });

    wx.showToast({ title: '已记录日记', icon: 'success' });

    this.setData({
      diaryText: '',
      selectedTagsMap: {}
    });

    this.loadDiaries();
  }
});
