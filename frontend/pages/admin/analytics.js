// pages/admin/analytics.js
const ChartHelper = require('../../utils/chart');

Page({
  data: {
    issuesRank: [
      { name: '学业与期末/考研压力', pct: 38, count: 540, color: '#EF4444' },
      { name: '人际交往与宿舍矛盾', pct: 26, count: 370, color: '#F97316' },
      { name: '职业生涯迷茫与择业', pct: 18, count: 255, color: '#EAB308' },
      { name: '亲密关系与情感困扰', pct: 12, count: 170, color: '#3B82F6' },
      { name: '原生家庭与自我认同', pct: 6, count: 85, color: '#10B981' }
    ]
  },

  onReady() {
    setTimeout(() => {
      this.initDonutChart();
      this.initBarChart();
      this.initTrendChart();
    }, 250);
  },

  initDonutChart() {
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
          { name: '积极充沛', value: 890, color: '#10B981' },
          { name: '平淡放空', value: 345, color: '#3B82F6' },
          { name: '轻度焦虑', value: 148, color: '#F59E0B' },
          { name: '重度预警', value: 37, color: '#EF4444' }
        ];

        ChartHelper.drawDonutChart(ctx, width, height, donutData, '全校心晴');
      });
  },

  initBarChart() {
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
          { name: '数媒院', value: 42, color: '#06B6D4' },
          { name: '计科院', value: 58, color: '#3B82F6' },
          { name: '经管院', value: 36, color: '#10B981' },
          { name: '外语院', value: 24, color: '#A855F7' },
          { name: '机电院', value: 31, color: '#F59E0B' }
        ];

        ChartHelper.drawBarChart(ctx, width, height, collegeData);
      });
  },

  initTrendChart() {
    const query = wx.createSelectorQuery();
    query.select('#adminTrendCanvas')
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
          color: '#06B6D4',
          minVal: 50,
          maxVal: 550
        });
      });
  }
});
