// pages/assessment/report.js - 测评报告
const storage = require('../../utils/storage');
const ChartHelper = require('../../utils/chart');

Page({
  data: {
    reportId: '',
    report: {}
  },

  onLoad(options) {
    const reportId = options.id;
    let report = null;

    if (reportId) {
      report = storage.getAssessmentById(reportId);
    }
    if (!report) {
      const history = storage.getAssessmentHistory();
      report = history[0] || {};
    }

    this.setData({
      reportId: report.id,
      report
    });
  },

  onReady() {
    setTimeout(() => {
      this.drawRadar();
      this.drawTrend();
    }, 200);
  },

  drawRadar() {
    const query = wx.createSelectorQuery();
    query.select('#radarCanvas')
      .fields({ node: true, size: true })
      .exec((res) => {
        if (!res[0] || !res[0].node) return;
        const canvas = res[0].node;
        const ctx = canvas.getContext('2d');
        const dpr = wx.getSystemInfoSync().pixelRatio || 2;
        const width = res[0].width;
        const height = res[0].height;

        canvas.width = width * dpr;
        canvas.height = height * dpr;
        ctx.scale(dpr, dpr);

        const dimensions = this.data.report.dimensionScores || [
          { name: '情绪低落', score: 45, full: 100 },
          { name: '躯体障碍', score: 38, full: 100 },
          { name: '精神运动', score: 30, full: 100 },
          { name: '认知功能', score: 40, full: 100 },
          { name: '自我价值', score: 25, full: 100 },
          { name: '绝望风险', score: 10, full: 100 }
        ];

        ChartHelper.drawRadarChart(ctx, width, height, dimensions, {
          primaryColor: '#2d8cf0',
          fillColor: 'rgba(45, 140, 240, 0.25)'
        });
      });
  },

  drawTrend() {
    const query = wx.createSelectorQuery();
    query.select('#trendCanvas')
      .fields({ node: true, size: true })
      .exec((res) => {
        if (!res[0] || !res[0].node) return;
        const canvas = res[0].node;
        const ctx = canvas.getContext('2d');
        const dpr = wx.getSystemInfoSync().pixelRatio || 2;
        const width = res[0].width;
        const height = res[0].height;

        canvas.width = width * dpr;
        canvas.height = height * dpr;
        ctx.scale(dpr, dpr);

        const history = storage.getAssessmentHistory().slice(0, 5).reverse();
        let scores = history.map(h => h.standardScore);
        let labels = history.map((_, i) => `第${i + 1}次`);

        if (scores.length < 2) {
          scores = [46, 52, 48, this.data.report.standardScore || 50];
          labels = ['前测1', '前测2', '前测3', '本次'];
        }

        ChartHelper.drawTrendChart(ctx, width, height, scores, {
          labels,
          color: '#2d8cf0',
          minVal: 20,
          maxVal: 90
        });
      });
  },

  retest() {
    const scaleId = this.data.report.scaleId || 'sds';
    wx.redirectTo({
      url: `/pages/assessment/test?id=${scaleId}`
    });
  },

  navToAppoint() {
    wx.switchTab({
      url: '/pages/appointment/index'
    });
  }
});
