/**
 * 数字媒体交互 - Canvas 2D 高清图表渲染引擎
 * 支持：心理量表多维雷达图、情绪趋势折线图、环形比例图、柱状分布图
 */

const ChartHelper = {
  /**
   * 绘制心理量表多维雷达图 (Radar Chart)
   * @param {CanvasRenderingContext2D} ctx 
   * @param {number} width 画布宽
   * @param {number} height 画布高
   * @param {Array<{name: string, score: number, full: number}>} dimensions 维度数组
   * @param {Object} options 配置
   */
  drawRadarChart(ctx, width, height, dimensions, options = {}) {
    if (!ctx || !dimensions || dimensions.length < 3) return;

    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) * 0.36;
    const count = dimensions.length;
    const angleStep = (Math.PI * 2) / count;
    const startAngle = -Math.PI / 2; // 从正上方顶点开始

    const primaryColor = options.primaryColor || '#3D8B75';
    const fillColor = options.fillColor || 'rgba(61, 139, 117, 0.28)';

    ctx.clearRect(0, 0, width, height);

    // 1. 绘制多边形背景网格 (4层环)
    const levels = 4;
    for (let l = 1; l <= levels; l++) {
      const levelRadius = (radius * l) / levels;
      ctx.beginPath();
      for (let i = 0; i < count; i++) {
        const angle = startAngle + i * angleStep;
        const x = centerX + levelRadius * Math.cos(angle);
        const y = centerY + levelRadius * Math.sin(angle);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.strokeStyle = l === levels ? '#D0DDE5' : '#E8EFF2';
      ctx.lineWidth = 1;
      ctx.stroke();

      if (l % 2 === 0) {
        ctx.fillStyle = 'rgba(240, 246, 245, 0.4)';
        ctx.fill();
      }
    }

    // 2. 绘制放射轴线
    for (let i = 0; i < count; i++) {
      const angle = startAngle + i * angleStep;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);

      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(x, y);
      ctx.strokeStyle = '#D9E2E8';
      ctx.lineWidth = 1;
      ctx.stroke();

      // 绘制维度名称标签
      const labelDistance = radius + 22;
      const lx = centerX + labelDistance * Math.cos(angle);
      const ly = centerY + labelDistance * Math.sin(angle);

      ctx.font = 'bold 11px sans-serif';
      ctx.fillStyle = '#4A5568';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      const item = dimensions[i];
      ctx.fillText(`${item.name} (${item.score})`, lx, ly);
    }

    // 3. 绘制数据区域多边形
    ctx.beginPath();
    const dataPoints = [];
    for (let i = 0; i < count; i++) {
      const angle = startAngle + i * angleStep;
      const valRatio = Math.max(0.08, Math.min(1, dimensions[i].score / (dimensions[i].full || 100)));
      const curRadius = radius * valRatio;
      const x = centerX + curRadius * Math.cos(angle);
      const y = centerY + curRadius * Math.sin(angle);
      dataPoints.push({ x, y });

      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();

    ctx.fillStyle = fillColor;
    ctx.fill();
    ctx.strokeStyle = primaryColor;
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // 4. 绘制数据顶点圆点
    dataPoints.forEach(pt => {
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#FFFFFF';
      ctx.fill();
      ctx.strokeStyle = primaryColor;
      ctx.lineWidth = 2.5;
      ctx.stroke();
    });
  },

  /**
   * 绘制情绪/量表趋势折线图 (Trend Line Chart)
   * @param {CanvasRenderingContext2D} ctx 
   * @param {number} width 
   * @param {number} height 
   * @param {Array<number>} values 数据值数组
   * @param {Object} options labels, title, minVal, maxVal
   */
  drawTrendChart(ctx, width, height, values, options = {}) {
    if (!ctx || !values || values.length === 0) return;

    ctx.clearRect(0, 0, width, height);

    const padding = { top: 30, right: 25, bottom: 35, left: 35 };
    const chartW = width - padding.left - padding.right;
    const chartH = height - padding.top - padding.bottom;

    const labels = options.labels || values.map((_, i) => `${i + 1}次`);
    const minVal = options.minVal !== undefined ? options.minVal : 20;
    const maxVal = options.maxVal !== undefined ? options.maxVal : 100;
    const range = maxVal - minVal || 1;

    // 1. 绘制水平参考线与刻度
    const ySteps = 4;
    for (let i = 0; i <= ySteps; i++) {
      const y = padding.top + (chartH / ySteps) * i;
      const val = Math.round(maxVal - (range / ySteps) * i);

      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(width - padding.right, y);
      ctx.strokeStyle = i === ySteps ? '#CBD5E1' : '#F1F5F9';
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.font = '10px sans-serif';
      ctx.fillStyle = '#94A3B8';
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      ctx.fillText(String(val), padding.left - 6, y);
    }

    // 2. 计算数据坐标
    const stepX = chartW / Math.max(1, values.length - 1);
    const coords = values.map((val, idx) => {
      const x = padding.left + idx * stepX;
      const y = padding.top + chartH - ((val - minVal) / range) * chartH;
      return { x, y, val, label: labels[idx] };
    });

    // 3. 绘制平滑曲线与阴影闭合区域
    if (coords.length > 1) {
      // 渐变填充背景
      ctx.beginPath();
      ctx.moveTo(coords[0].x, padding.top + chartH);
      ctx.lineTo(coords[0].x, coords[0].y);

      for (let i = 0; i < coords.length - 1; i++) {
        const cur = coords[i];
        const next = coords[i + 1];
        const cx = (cur.x + next.x) / 2;
        ctx.bezierCurveTo(cx, cur.y, cx, next.y, next.x, next.y);
      }

      ctx.lineTo(coords[coords.length - 1].x, padding.top + chartH);
      ctx.closePath();

      const gradient = ctx.createLinearGradient(0, padding.top, 0, padding.top + chartH);
      gradient.addColorStop(0, 'rgba(61, 139, 117, 0.35)');
      gradient.addColorStop(1, 'rgba(61, 139, 117, 0.02)');
      ctx.fillStyle = gradient;
      ctx.fill();

      // 绘制曲折线
      ctx.beginPath();
      ctx.moveTo(coords[0].x, coords[0].y);
      for (let i = 0; i < coords.length - 1; i++) {
        const cur = coords[i];
        const next = coords[i + 1];
        const cx = (cur.x + next.x) / 2;
        ctx.bezierCurveTo(cx, cur.y, cx, next.y, next.x, next.y);
      }
      ctx.strokeStyle = options.color || '#3D8B75';
      ctx.lineWidth = 3;
      ctx.stroke();
    }

    // 4. 绘制数据点与标签数值
    coords.forEach(pt => {
      // X轴标签
      ctx.font = '10px sans-serif';
      ctx.fillStyle = '#64748B';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillText(pt.label, pt.x, padding.top + chartH + 8);

      // 数据数值气泡
      ctx.font = 'bold 11px sans-serif';
      ctx.fillStyle = options.color || '#3D8B75';
      ctx.textBaseline = 'bottom';
      ctx.fillText(String(pt.val), pt.x, pt.y - 6);

      // 点
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, 4.5, 0, Math.PI * 2);
      ctx.fillStyle = '#FFFFFF';
      ctx.fill();
      ctx.strokeStyle = options.color || '#3D8B75';
      ctx.lineWidth = 2.5;
      ctx.stroke();
    });
  },

  /**
   * 绘制数据大屏环形图 (Donut Chart)
   */
  drawDonutChart(ctx, width, height, dataList, centerText = '情绪晴雨表') {
    if (!ctx || !dataList || dataList.length === 0) return;

    ctx.clearRect(0, 0, width, height);

    const centerX = width * 0.38;
    const centerY = height / 2;
    const outerRadius = Math.min(width, height) * 0.36;
    const innerRadius = outerRadius * 0.62;

    const total = dataList.reduce((acc, cur) => acc + cur.value, 0) || 1;
    let startAngle = -Math.PI / 2;

    dataList.forEach(item => {
      const sliceAngle = (item.value / total) * Math.PI * 2;
      const endAngle = startAngle + sliceAngle;

      ctx.beginPath();
      ctx.arc(centerX, centerY, outerRadius, startAngle, endAngle);
      ctx.arc(centerX, centerY, innerRadius, endAngle, startAngle, true);
      ctx.closePath();

      ctx.fillStyle = item.color;
      ctx.fill();

      startAngle = endAngle;
    });

    // 中心文字
    ctx.font = 'bold 12px sans-serif';
    ctx.fillStyle = '#1E293B';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(centerText, centerX, centerY - 6);

    ctx.font = '10px sans-serif';
    ctx.fillStyle = '#64748B';
    ctx.fillText(`样本 ${total}人`, centerX, centerY + 10);

    // 右侧图例
    const legendX = width * 0.68;
    const legendStartY = height * 0.2;
    dataList.forEach((item, idx) => {
      const y = legendStartY + idx * 24;

      ctx.beginPath();
      ctx.arc(legendX, y, 4, 0, Math.PI * 2);
      ctx.fillStyle = item.color;
      ctx.fill();

      ctx.font = '10px sans-serif';
      ctx.fillStyle = '#475569';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      const pct = Math.round((item.value / total) * 100);
      ctx.fillText(`${item.name} ${pct}%`, legendX + 10, y);
    });
  },

  /**
   * 绘制数据大屏柱状图 (Bar Chart)
   */
  drawBarChart(ctx, width, height, items, options = {}) {
    if (!ctx || !items || items.length === 0) return;

    ctx.clearRect(0, 0, width, height);
    const pad = { top: 20, right: 15, bottom: 25, left: 35 };
    const chartW = width - pad.left - pad.right;
    const chartH = height - pad.top - pad.bottom;

    const maxVal = Math.max(...items.map(i => i.value), 10);
    const barWidth = Math.min(28, (chartW / items.length) * 0.55);
    const gap = chartW / items.length;

    // 基准线
    ctx.beginPath();
    ctx.moveTo(pad.left, pad.top + chartH);
    ctx.lineTo(width - pad.right, pad.top + chartH);
    ctx.strokeStyle = '#E2E8F0';
    ctx.stroke();

    items.forEach((item, idx) => {
      const x = pad.left + idx * gap + (gap - barWidth) / 2;
      const bH = (item.value / maxVal) * chartH;
      const y = pad.top + chartH - bH;

      // 绘制柱体圆角矩形
      ctx.fillStyle = item.color || '#3D8B75';
      ctx.beginPath();
      ctx.rect(x, y, barWidth, bH);
      ctx.fill();

      // 数值
      ctx.font = 'bold 10px sans-serif';
      ctx.fillStyle = '#475569';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'bottom';
      ctx.fillText(String(item.value), x + barWidth / 2, y - 2);

      // 名称
      ctx.font = '10px sans-serif';
      ctx.fillStyle = '#64748B';
      ctx.textBaseline = 'top';
      ctx.fillText(item.name, x + barWidth / 2, pad.top + chartH + 5);
    });
  }
};

module.exports = ChartHelper;
