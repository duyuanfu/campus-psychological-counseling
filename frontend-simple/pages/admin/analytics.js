// pages/admin/analytics.js - 数据看板
const ChartHelper = require('../../utils/chart');

Page({
  onReady() {
    setTimeout(() => {
      this.drawDonut();
      this.drawBar();
      this.drawTrend();
    }, 200);
  },

  drawDonut() {
    const query = wx.createSelectorQuery();
    query.select('#donutCanvas')
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

        const donutData = [
          { name: '积极充沛', value: 890, color: '#19be6b' },
          { name: '平淡放空', value: 345, color: '#2d8cf0' },
          { name: '轻度焦虑', value: 148, color: '#ff9900' },
          { name: '重度预警', value: 37, color: '#ed4014' }
        ];

        ChartHelper.drawDonutChart(ctx, width, height, donutData, '全校心晴');
      });
  },

  drawBar() {
    const query = wx.createSelectorQuery();
    query.select('#barCanvas')
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

        const collegeData = [
          { name: '数媒院', value: 42, color: '#2d8cf0' },
          { name: '计科院', value: 58, color: '#19be6b' },
          { name: '经管院', value: 36, color: '#ff9900' },
          { name: '外语院', value: 24, color: '#722ed1' }
        ];

        ChartHelper.drawBarChart(ctx, width, height, collegeData);
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

        const monthlyConsults = [120, 185, 340, 290, 485];
        const months = ['1月', '2月', '3月', '4月', '5月'];

        ChartHelper.drawTrendChart(ctx, width, height, monthlyConsults, {
          labels: months,
          color: '#2d8cf0',
          minVal: 50,
          maxVal: 550
        });
      });
  }
});
