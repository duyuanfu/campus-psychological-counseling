// pages/relax/relax.js
const mockData = require('../../utils/mockData');

Page({
  data: {
    activeTab: 'breath', // 'breath' | 'sound'

    // 4-7-8 呼吸训练数据
    isBreathing: false,
    breathPhase: 'idle', // 'inhale' | 'hold' | 'exhale' | 'idle'
    phaseText: '准备就绪',
    guidanceTip: '点击下方按钮，开始 4-7-8 节律呼吸',
    countDown: 4,
    completedCycles: 0,
    totalBreathMinutes: 0,

    // 白噪音数据
    soundTracks: [],
    currentTrack: null,
    isPlayingSound: false,
    timerOptions: ['不定时', '15分钟', '30分钟', '60分钟'],
    timerIndex: 0
  },

  breathInterval: null,

  onLoad(options) {
    const tab = (options.tab === 'sound') ? 'sound' : 'breath';
    const tracks = mockData.SOUND_TRACKS;

    this.setData({
      activeTab: tab,
      soundTracks: tracks,
      currentTrack: tracks[0]
    });
  },

  onUnload() {
    this.stopBreathing();
  },

  switchTab(e) {
    const tab = e.currentTarget.dataset.tab;
    this.setData({ activeTab: tab });
  },

  // ----------------- 4-7-8 呼吸动效逻辑 -----------------
  toggleBreathing() {
    if (this.data.isBreathing) {
      this.stopBreathing();
    } else {
      this.startBreathing();
    }
  },

  startBreathing() {
    this.setData({
      isBreathing: true,
      breathPhase: 'inhale',
      phaseText: '鼻吸气 4s',
      guidanceTip: '【吸气】用鼻子平稳深吸气，让小腹自然隆起...',
      countDown: 4
    });

    wx.vibrateShort && wx.vibrateShort({ type: 'medium' });
    this.runBreathCycle();
  },

  stopBreathing() {
    clearInterval(this.breathInterval);
    this.breathInterval = null;
    this.setData({
      isBreathing: false,
      breathPhase: 'idle',
      phaseText: '已暂停',
      guidanceTip: '已暂停练习，随时可以再次开启'
    });
  },

  runBreathCycle() {
    let phase = 'inhale'; // inhale: 4s, hold: 7s, exhale: 8s
    let remaining = 4;

    this.breathInterval = setInterval(() => {
      remaining--;

      if (remaining <= 0) {
        if (phase === 'inhale') {
          phase = 'hold';
          remaining = 7;
          this.setData({
            breathPhase: 'hold',
            phaseText: '屏息 7s',
            guidanceTip: '【屏息】屏住呼吸，感受内心的宁静与平衡...'
          });
          wx.vibrateShort && wx.vibrateShort({ type: 'light' });
        } else if (phase === 'hold') {
          phase = 'exhale';
          remaining = 8;
          this.setData({
            breathPhase: 'exhale',
            phaseText: '缓呼气 8s',
            guidanceTip: '【呼气】用嘴缓缓吐出长气，带走所有紧张与杂念...'
          });
          wx.vibrateShort && wx.vibrateShort({ type: 'medium' });
        } else if (phase === 'exhale') {
          phase = 'inhale';
          remaining = 4;
          const nextCycles = this.data.completedCycles + 1;
          const nextMinutes = (nextCycles * 19 / 60).toFixed(1);

          this.setData({
            breathPhase: 'inhale',
            phaseText: '鼻吸气 4s',
            guidanceTip: '【吸气】再次吸气，新一轮能量正在注入...',
            completedCycles: nextCycles,
            totalBreathMinutes: Number(nextMinutes)
          });
          wx.vibrateShort && wx.vibrateShort({ type: 'heavy' });
        }
      }

      this.setData({ countDown: remaining });
    }, 1000);
  },

  // ----------------- 白噪音播放逻辑 -----------------
  selectTrack(e) {
    const item = e.currentTarget.dataset.item;
    this.setData({ currentTrack: item });

    if (this.data.isPlayingSound) {
      wx.showToast({ title: `切换为: ${item.name}`, icon: 'none' });
    }
  },

  toggleSoundPlay() {
    const willPlay = !this.data.isPlayingSound;
    this.setData({ isPlayingSound: willPlay });

    if (willPlay) {
      wx.showToast({
        title: `播放中: ${this.data.currentTrack.name}`,
        icon: 'none'
      });
    } else {
      wx.showToast({ title: '已暂停播放', icon: 'none' });
    }
  },

  onTimerChange(e) {
    const idx = Number(e.detail.value);
    this.setData({ timerIndex: idx });
    const text = this.data.timerOptions[idx];
    if (text !== '不定时') {
      wx.showToast({ title: `已设置${text}后自动关闭`, icon: 'none' });
    }
  }
});
