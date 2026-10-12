// pages/relax/relax.js - 放松训练
const mockData = require('../../utils/mockData');

Page({
  data: {
    isRunning: false,
    breathState: 'idle',
    stateText: '就绪',
    countdown: 4,

    tracks: [],
    currentTrack: {},
    isPlaying: false
  },

  timer: null,

  onLoad() {
    const list = mockData.SOUND_TRACKS;
    this.setData({
      tracks: list,
      currentTrack: list[0]
    });
  },

  onUnload() {
    clearInterval(this.timer);
  },

  toggleBreath() {
    if (this.data.isRunning) {
      clearInterval(this.timer);
      this.setData({
        isRunning: false,
        breathState: 'idle',
        stateText: '暂停',
        countdown: 4
      });
    } else {
      this.setData({
        isRunning: true,
        breathState: 'inhale',
        stateText: '吸气 4s',
        countdown: 4
      });
      this.runBreath();
    }
  },

  runBreath() {
    let phase = 'inhale';
    let count = 4;

    this.timer = setInterval(() => {
      count--;
      if (count <= 0) {
        if (phase === 'inhale') {
          phase = 'hold';
          count = 7;
          this.setData({ breathState: 'hold', stateText: '屏息 7s' });
        } else if (phase === 'hold') {
          phase = 'exhale';
          count = 8;
          this.setData({ breathState: 'exhale', stateText: '呼气 8s' });
        } else if (phase === 'exhale') {
          phase = 'inhale';
          count = 4;
          this.setData({ breathState: 'inhale', stateText: '吸气 4s' });
        }
      }
      this.setData({ countdown: count });
    }, 1000);
  },

  selectTrack(e) {
    const item = e.currentTarget.dataset.item;
    this.setData({ currentTrack: item });
  },

  toggleSound() {
    const next = !this.data.isPlaying;
    this.setData({ isPlaying: next });
    wx.showToast({
      title: next ? `播放: ${this.data.currentTrack.name}` : '已暂停',
      icon: 'none'
    });
  }
});
