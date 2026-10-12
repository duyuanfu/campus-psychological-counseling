// pages/treehole/post.js
const storage = require('../../utils/storage');

const NAMES = ['温暖的向日葵', '深海里的蓝鲸', '林间奔跑的小鹿', '追光的纸飞机', '微风中的银杏', '晨曦的小白鸽', '星空下的潜水艇'];
const EMOJIS = ['🌻', '🐋', '🦌', '✈️', '🍂', '🕊️', '⭐', '🧸'];
const COLORS = ['#FA8C16', '#1890FF', '#52C41A', '#722ED1', '#FAAD14', '#13C2C2'];

Page({
  data: {
    anonymousName: '温暖的向日葵',
    avatarTag: '🌻',
    avatarColor: '#FA8C16',
    categories: ['学业困惑', '人际关系', '情感树洞', '求助求抱抱', '心情碎碎念'],
    selectedTag: '学业困惑',
    content: ''
  },

  onLoad() {
    this.randomizeIdentity();
  },

  randomizeIdentity() {
    const nIdx = Math.floor(Math.random() * NAMES.length);
    const eIdx = Math.floor(Math.random() * EMOJIS.length);
    const cIdx = Math.floor(Math.random() * COLORS.length);

    this.setData({
      anonymousName: NAMES[nIdx],
      avatarTag: EMOJIS[eIdx],
      avatarColor: COLORS[cIdx]
    });
  },

  onSelectTag(e) {
    this.setData({ selectedTag: e.currentTarget.dataset.tag });
  },

  onInputContent(e) {
    this.setData({ content: e.detail.value });
  },

  submitPost() {
    const { content, selectedTag, anonymousName, avatarTag, avatarColor } = this.data;

    if (!content.trim()) {
      wx.showToast({ title: '请输入倾诉内容', icon: 'none' });
      return;
    }

    // 危机词敏感词安全检测
    const crisisWords = ['自杀', '轻生', '不想活了', '跳楼', '割腕'];
    const hasCrisis = crisisWords.some(w => content.includes(w));

    if (hasCrisis) {
      // 触发危机干预
      storage.triggerCrisisAlert({
        level: 'red',
        levelName: '重度高危 (树洞言论触发)',
        triggerReason: `树洞匿名言论包含高危倾向词：“${content.slice(0, 30)}...”`,
        scaleScore: 90
      });
    }

    storage.createTreeholePost({
      anonymousName,
      avatarTag,
      avatarColor,
      tag: selectedTag,
      content: content.trim()
    });

    wx.showToast({ title: '已倾诉投入树洞', icon: 'success' });

    setTimeout(() => {
      wx.navigateBack();
    }, 1200);
  }
});
