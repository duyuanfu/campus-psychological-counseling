/**
 * 本地持久化与模拟数据服务中心
 */
const mockData = require('./mockData');

const KEYS = {
  CURRENT_ROLE: 'xys_current_role',
  USERS: 'xys_users',
  COUNSELORS: 'xys_counselors',
  APPOINTMENTS: 'xys_appointments',
  ASSESSMENTS: 'xys_assessments',
  TREEHOLE_POSTS: 'xys_treehole_posts',
  MOOD_DIARIES: 'xys_mood_diaries',
  CRISIS_ALERTS: 'xys_crisis_alerts',
  COUNSELING_RECORDS: 'xys_counseling_records',
  ARTICLES: 'xys_articles',
  COUNSELOR_SCHEDULES: 'xys_counselor_schedules'
};

const StorageService = {
  // 初始化存储
  init() {
    if (!wx.getStorageSync(KEYS.CURRENT_ROLE)) {
      wx.setStorageSync(KEYS.CURRENT_ROLE, mockData.ROLES.STUDENT);
    }
    if (!wx.getStorageSync(KEYS.USERS)) {
      wx.setStorageSync(KEYS.USERS, mockData.DEFAULT_USERS);
    }
    if (!wx.getStorageSync(KEYS.COUNSELORS)) {
      wx.setStorageSync(KEYS.COUNSELORS, mockData.COUNSELORS);
    }
    if (!wx.getStorageSync(KEYS.APPOINTMENTS)) {
      wx.setStorageSync(KEYS.APPOINTMENTS, mockData.INITIAL_APPOINTMENTS);
    }
    if (!wx.getStorageSync(KEYS.ASSESSMENTS)) {
      wx.setStorageSync(KEYS.ASSESSMENTS, mockData.INITIAL_ASSESSMENT_REPORTS);
    }
    if (!wx.getStorageSync(KEYS.TREEHOLE_POSTS)) {
      wx.setStorageSync(KEYS.TREEHOLE_POSTS, mockData.TREEHOLE_POSTS);
    }
    if (!wx.getStorageSync(KEYS.MOOD_DIARIES)) {
      wx.setStorageSync(KEYS.MOOD_DIARIES, mockData.INITIAL_MOOD_DIARIES);
    }
    if (!wx.getStorageSync(KEYS.CRISIS_ALERTS)) {
      wx.setStorageSync(KEYS.CRISIS_ALERTS, mockData.CRISIS_ALERTS);
    }
    if (!wx.getStorageSync(KEYS.COUNSELING_RECORDS)) {
      wx.setStorageSync(KEYS.COUNSELING_RECORDS, mockData.COUNSELING_RECORDS);
    }
    if (!wx.getStorageSync(KEYS.ARTICLES)) {
      wx.setStorageSync(KEYS.ARTICLES, mockData.ARTICLES);
    }
    if (!wx.getStorageSync(KEYS.COUNSELOR_SCHEDULES)) {
      // 默认排班表：周一至周五，每天上午/下午可选时段
      const defaultSchedule = {
        'c_2001': {
          days: ['周二', '周三', '周四', '周五'],
          slots: ['09:00 - 10:00', '10:30 - 11:30', '14:30 - 15:30', '16:00 - 17:00'],
          maxPerDay: 4
        },
        'c_2002': {
          days: ['周一', '周三', '周六'],
          slots: ['14:00 - 15:00', '15:30 - 16:30', '18:30 - 19:30'],
          maxPerDay: 3
        },
        'c_2003': {
          days: ['周一', '周二', '周三', '周四'],
          slots: ['13:30 - 14:30', '15:00 - 16:00', '16:30 - 17:30'],
          maxPerDay: 3
        }
      };
      wx.setStorageSync(KEYS.COUNSELOR_SCHEDULES, defaultSchedule);
    }
  },

  // 角色管理
  getCurrentRole() {
    return wx.getStorageSync(KEYS.CURRENT_ROLE) || mockData.ROLES.STUDENT;
  },
  setCurrentRole(role) {
    wx.setStorageSync(KEYS.CURRENT_ROLE, role);
  },
  getCurrentUser() {
    const role = this.getCurrentRole();
    const users = wx.getStorageSync(KEYS.USERS) || mockData.DEFAULT_USERS;
    return users[role] || users.student;
  },
  updateCurrentUser(userData) {
    const role = this.getCurrentRole();
    const users = wx.getStorageSync(KEYS.USERS) || mockData.DEFAULT_USERS;
    users[role] = { ...users[role], ...userData };
    wx.setStorageSync(KEYS.USERS, users);
    return users[role];
  },

  // 咨询师
  getCounselors() {
    return wx.getStorageSync(KEYS.COUNSELORS) || mockData.COUNSELORS;
  },
  getCounselorById(id) {
    const list = this.getCounselors();
    return list.find(c => c.id === id) || list[0];
  },

  // 排班设置
  getCounselorSchedule(counselorId) {
    const schedules = wx.getStorageSync(KEYS.COUNSELOR_SCHEDULES) || {};
    return schedules[counselorId] || {
      days: ['周一', '周二', '周三', '周四', '周五'],
      slots: ['09:00 - 10:00', '14:30 - 15:30'],
      maxPerDay: 3
    };
  },
  updateCounselorSchedule(counselorId, scheduleData) {
    const schedules = wx.getStorageSync(KEYS.COUNSELOR_SCHEDULES) || {};
    schedules[counselorId] = scheduleData;
    wx.setStorageSync(KEYS.COUNSELOR_SCHEDULES, schedules);
    return schedules[counselorId];
  },

  // 预约业务
  getAppointments(filter = {}) {
    let list = wx.getStorageSync(KEYS.APPOINTMENTS) || [];
    if (filter.studentId) {
      list = list.filter(item => item.studentId === filter.studentId);
    }
    if (filter.counselorId) {
      list = list.filter(item => item.counselorId === filter.counselorId);
    }
    if (filter.status && filter.status !== 'all') {
      list = list.filter(item => item.status === filter.status);
    }
    return list;
  },
  getAppointmentById(id) {
    const list = wx.getStorageSync(KEYS.APPOINTMENTS) || [];
    return list.find(item => item.id === id);
  },
  createAppointment(data) {
    const list = wx.getStorageSync(KEYS.APPOINTMENTS) || [];
    const newApt = {
      id: 'apt_' + Date.now(),
      status: 'pending',
      statusText: '待咨询师确认',
      createdAt: new Date().toISOString(),
      ...data
    };
    list.unshift(newApt);
    wx.setStorageSync(KEYS.APPOINTMENTS, list);
    return newApt;
  },
  updateAppointmentStatus(id, status, feedbackNotes = '') {
    const list = wx.getStorageSync(KEYS.APPOINTMENTS) || [];
    const index = list.findIndex(item => item.id === id);
    if (index !== -1) {
      const statusTextMap = {
        pending: '待确认',
        confirmed: '已确认预约',
        rejected: '已驳回申请',
        completed: '咨询已完成',
        canceled: '已取消预约'
      };
      list[index].status = status;
      list[index].statusText = statusTextMap[status] || status;
      if (feedbackNotes) {
        list[index].feedbackNotes = feedbackNotes;
      }
      wx.setStorageSync(KEYS.APPOINTMENTS, list);
      return list[index];
    }
    return null;
  },
  rescheduleAppointment(id, newDate, newSlot) {
    const list = wx.getStorageSync(KEYS.APPOINTMENTS) || [];
    const index = list.findIndex(item => item.id === id);
    if (index !== -1) {
      list[index].date = newDate;
      list[index].timeSlot = newSlot;
      list[index].status = 'pending';
      list[index].statusText = '已申请改约 (待确认)';
      list[index].feedbackNotes = '学生重新选择了预约时段，等待咨询师确认。';
      wx.setStorageSync(KEYS.APPOINTMENTS, list);
      return list[index];
    }
    return null;
  },

  // 心理量表与测评
  getScales() {
    return mockData.SCALES;
  },
  getScaleById(id) {
    return mockData.SCALES.find(s => s.id === id) || mockData.SCALES[0];
  },
  // 计分算法及报告生成
  evaluateScale(scaleId, answers) {
    const scale = this.getScaleById(scaleId);
    let rawScore = 0;
    const questions = scale.questions;

    // 统计各维度得分
    const dimScoreMap = {};
    const dimCountMap = {};

    questions.forEach((q, idx) => {
      let chosenScore = answers[idx] || 1;
      let finalItemScore = chosenScore;
      if (q.reverse) {
        // 反向计分: 1->4, 2->3, 3->2, 4->1
        finalItemScore = 5 - chosenScore;
      }
      rawScore += finalItemScore;

      const dim = q.dim || '综合状态';
      dimScoreMap[dim] = (dimScoreMap[dim] || 0) + finalItemScore;
      dimCountMap[dim] = (dimCountMap[dim] || 0) + 1;
    });

    // 计算标准分 (中国常模标准分 = 粗分 * 1.25 取整)
    const standardScore = Math.round(rawScore * 1.25);

    let level = 'normal';
    let levelTitle = '正常健康';
    let levelColor = '#52C41A';
    let analysis = '';
    let suggestions = [];

    if (scaleId === 'sds') {
      // SDS标准界限：<53 正常，53-62 轻度，63-72 中度，>=73 重度
      if (standardScore < 53) {
        level = 'normal';
        levelTitle = '正常心境 (无抑郁倾向)';
        levelColor = '#52C41A';
        analysis = `您的SDS抑郁标准分为${standardScore}分（低于53分常模临界值），情绪总体处于平稳健康的积极区间。能够较好地应对校园日常学业和社交事务。`;
        suggestions = [
          '保持现有良好生活作息与适度运动；',
          '通过情绪日记继续觉察自我心态微变；',
          '在期末高压期适度留白放松。'
        ];
      } else if (standardScore <= 62) {
        level = 'mild';
        levelTitle = '轻度情绪低落';
        levelColor = '#FAAD14';
        analysis = `您的SDS抑郁标准分为${standardScore}分（介于53-62分），显示近期存在一定程度的情绪低沉、疲乏或动力不足。`;
        suggestions = [
          '多去操场晒太阳，进行轻度有氧运动（快走、慢跑）；',
          '每天尝试使用白噪音或呼吸训练放松10分钟；',
          '可尝试在树洞匿名倾诉，或与知心好友倾诉释放。'
        ];
      } else if (standardScore <= 72) {
        level = 'moderate';
        levelTitle = '中度抑郁状态';
        levelColor = '#FF8E53';
        analysis = `您的SDS抑郁标准分为${standardScore}分（介于63-72分），表明负面情绪对近期的睡眠、思维注意力和人际交流产生了较明显阻碍。`;
        suggestions = [
          '建议主动预约本校心理健康中心专职咨询师进行深入沟通；',
          '减少自我责备，允许自己暂时停顿休整；',
          '规律作息，切勿长期独处熬夜。'
        ];
      } else {
        level = 'severe';
        levelTitle = '重度抑郁预警';
        levelColor = '#F5222D';
        analysis = `您的SDS抑郁标准分为${standardScore}分（达到或超过73分），属于临床重度预警区间，伴随显著的心境压抑、躯体症状或无助感。系统已同步关注。`;
        suggestions = [
          '【重要关怀】请第一时间联系学校心理中心或辅导员寻求专业支援；',
          '请拨打本校24小时心理危机热线：010-88886666；',
          '记住：你不是孤身一人，痛苦是可以被化解和治愈的。'
        ];

        // 自动触发危机预警
        this.triggerCrisisAlert({
          studentName: this.getCurrentUser().name,
          studentId: this.getCurrentUser().studentId,
          level: 'red',
          levelName: '重度红色预警 (SDS重度超标)',
          triggerReason: `SDS测评达${standardScore}分 (标准分>=73分)`,
          scaleScore: standardScore
        });
      }
    } else {
      // SAS标准界限：<50 正常，50-59 轻度焦虑，60-69 中度焦虑，>=70 重度焦虑
      if (standardScore < 50) {
        level = 'normal';
        levelTitle = '身心平静 (无焦虑症状)';
        levelColor = '#52C41A';
        analysis = `您的SAS焦虑标准分为${standardScore}分（低于50分），身体神经系统和主观心态处于自然放松的平衡态。`;
        suggestions = [
          '保持平稳专注的学习与生活节奏；',
          '遇到突发DDL时做好时间规划即可。'
        ];
      } else if (standardScore <= 59) {
        level = 'mild';
        levelTitle = '轻度焦虑紧张';
        levelColor = '#FAAD14';
        analysis = `您的SAS标准分为${standardScore}分（50-59分），近期对学业、社交或未来规划存在一定担忧与紧张感。`;
        suggestions = [
          '练习4-7-8呼吸法，激活副交感神经缓解紧绷；',
          '将复杂任务拆解为15分钟小步骤降低心智负担。'
        ];
      } else if (standardScore <= 69) {
        level = 'moderate';
        levelTitle = '中度焦虑状态';
        levelColor = '#FF8E53';
        analysis = `您的SAS标准分为${standardScore}分（60-69分），伴随心慌、失眠、肌肉紧张等较明显的躯体化自主神经症状。`;
        suggestions = [
          '建议预约心理咨询师进行认知行为疏导；',
          '减少咖啡因摄入，睡前停止刷手机；',
          '尝试通过每日正念冥想恢复节律。'
        ];
      } else {
        level = 'severe';
        levelTitle = '重度焦虑预警';
        levelColor = '#F5222D';
        analysis = `您的SAS标准分为${standardScore}分（70分及以上），焦虑水平极高，可能伴随持续恐慌、呼吸浅急或严重躯体不适。`;
        suggestions = [
          '【重要关怀】请及时前往心理中心面谈评估；',
          '必要时前往三甲医院心理科进行医学辅导；',
          '心理中心值班电话：010-88886666。'
        ];

        this.triggerCrisisAlert({
          studentName: this.getCurrentUser().name,
          studentId: this.getCurrentUser().studentId,
          level: 'red',
          levelName: '重度红色预警 (SAS焦虑重度)',
          triggerReason: `SAS测评达${standardScore}分 (标准分>=70分)`,
          scaleScore: standardScore
        });
      }
    }

    // 格式化维度分数（归一化为百分制雷达图数据）
    const dimensionScores = Object.keys(dimScoreMap).map(dimName => {
      const avg = dimScoreMap[dimName] / dimCountMap[dimName];
      const normScore = Math.round((avg / 4) * 100);
      return {
        name: dimName,
        score: normScore,
        full: 100
      };
    });

    const report = {
      id: 'rep_' + Date.now(),
      scaleId,
      scaleTitle: scale.title,
      date: new Date().toLocaleDateString() + ' ' + new Date().toTimeString().slice(0, 5),
      rawScore,
      standardScore,
      level,
      levelTitle,
      levelColor,
      dimensionScores,
      analysis,
      suggestions
    };

    // 保存到历史测评
    const history = wx.getStorageSync(KEYS.ASSESSMENTS) || [];
    history.unshift(report);
    wx.setStorageSync(KEYS.ASSESSMENTS, history);

    return report;
  },
  getAssessmentHistory() {
    return wx.getStorageSync(KEYS.ASSESSMENTS) || [];
  },
  getAssessmentById(id) {
    const list = this.getAssessmentHistory();
    return list.find(item => item.id === id);
  },

  // 危机预警专区
  getCrisisAlerts() {
    return wx.getStorageSync(KEYS.CRISIS_ALERTS) || [];
  },
  triggerCrisisAlert(alertData) {
    const alerts = wx.getStorageSync(KEYS.CRISIS_ALERTS) || [];
    const newAlert = {
      id: 'alert_' + Date.now(),
      triggerTime: new Date().toLocaleString(),
      status: 'pending',
      counselorInCharge: '陈清心',
      gender: '未知',
      college: '数字媒体与设计学院',
      grade: '大二',
      phone: '138****6688',
      ...alertData
    };
    alerts.unshift(newAlert);
    wx.setStorageSync(KEYS.CRISIS_ALERTS, alerts);
    return newAlert;
  },
  updateCrisisStatus(id, status, notes) {
    const alerts = wx.getStorageSync(KEYS.CRISIS_ALERTS) || [];
    const item = alerts.find(a => a.id === id);
    if (item) {
      item.status = status;
      if (notes) item.notes = notes;
      wx.setStorageSync(KEYS.CRISIS_ALERTS, alerts);
      return item;
    }
    return null;
  },

  // 咨询师咨询记录
  getCounselingRecords() {
    return wx.getStorageSync(KEYS.COUNSELING_RECORDS) || [];
  },
  saveCounselingRecord(record) {
    const list = wx.getStorageSync(KEYS.COUNSELING_RECORDS) || [];
    if (record.id) {
      const idx = list.findIndex(r => r.id === record.id);
      if (idx !== -1) {
        list[idx] = { ...list[idx], ...record };
      } else {
        list.unshift(record);
      }
    } else {
      record.id = 'rec_' + Date.now();
      list.unshift(record);
    }
    wx.setStorageSync(KEYS.COUNSELING_RECORDS, list);
    return record;
  },

  // 树洞帖子
  getTreeholePosts() {
    return wx.getStorageSync(KEYS.TREEHOLE_POSTS) || [];
  },
  getTreeholePostById(id) {
    const list = this.getTreeholePosts();
    return list.find(p => p.id === id);
  },
  createTreeholePost(data) {
    const list = this.getTreeholePosts();
    const animalNames = ['向日葵的晴天', '深海蓝鲸', '林间小鹿', '追光纸飞机', '微风银杏', '晨曦白鸽', '星夜水母'];
    const emojis = ['🌻', '🐋', '🦌', '✈️', '🍂', '🕊️', '🪼', '🧸'];
    const colors = ['#FA8C16', '#1890FF', '#52C41A', '#722ED1', '#FAAD14', '#13C2C2'];
    const randomIdx = Math.floor(Math.random() * animalNames.length);

    const newPost = {
      id: 'th_' + Date.now(),
      anonymousName: animalNames[randomIdx],
      avatarTag: emojis[randomIdx],
      avatarColor: colors[randomIdx % colors.length],
      timeDesc: '刚刚',
      hugCount: 0,
      isHugged: false,
      commentCount: 0,
      comments: [],
      status: 'normal',
      ...data
    };
    list.unshift(newPost);
    wx.setStorageSync(KEYS.TREEHOLE_POSTS, list);
    return newPost;
  },
  toggleTreeholeHug(postId) {
    const list = this.getTreeholePosts();
    const item = list.find(p => p.id === postId);
    if (item) {
      item.isHugged = !item.isHugged;
      item.hugCount = item.isHugged ? item.hugCount + 1 : Math.max(0, item.hugCount - 1);
      wx.setStorageSync(KEYS.TREEHOLE_POSTS, list);
      return item;
    }
    return null;
  },
  addTreeholeComment(postId, commentText) {
    const list = this.getTreeholePosts();
    const item = list.find(p => p.id === postId);
    if (item) {
      const newComment = {
        id: 'c_' + Date.now(),
        user: '温暖同路人',
        avatarTag: '🍀',
        text: commentText,
        time: '刚刚'
      };
      if (!item.comments) item.comments = [];
      item.comments.push(newComment);
      item.commentCount = item.comments.length;
      wx.setStorageSync(KEYS.TREEHOLE_POSTS, list);
      return item;
    }
    return null;
  },
  auditTreeholePost(postId, action) {
    // action: 'delete' | 'pass'
    let list = this.getTreeholePosts();
    if (action === 'delete') {
      list = list.filter(p => p.id !== postId);
    } else {
      const post = list.find(p => p.id === postId);
      if (post) post.status = 'approved';
    }
    wx.setStorageSync(KEYS.TREEHOLE_POSTS, list);
    return list;
  },

  // 情绪日记
  getMoodDiaries() {
    return wx.getStorageSync(KEYS.MOOD_DIARIES) || [];
  },
  saveMoodDiary(entry) {
    const list = this.getMoodDiaries();
    const newEntry = {
      id: 'mood_' + Date.now(),
      date: new Date().toISOString().slice(0, 10),
      dayStr: '今天',
      ...entry
    };
    list.unshift(newEntry);
    wx.setStorageSync(KEYS.MOOD_DIARIES, list);
    return newEntry;
  },

  // 文章
  getArticles() {
    return wx.getStorageSync(KEYS.ARTICLES) || mockData.ARTICLES;
  },
  getArticleById(id) {
    const list = this.getArticles();
    return list.find(a => a.id === id) || list[0];
  },
  saveArticle(article) {
    const list = this.getArticles();
    if (article.id) {
      const idx = list.findIndex(a => a.id === article.id);
      if (idx !== -1) list[idx] = { ...list[idx], ...article };
    } else {
      article.id = 'art_' + Date.now();
      article.date = new Date().toISOString().slice(0, 10);
      article.readCount = 0;
      article.likesCount = 0;
      list.unshift(article);
    }
    wx.setStorageSync(KEYS.ARTICLES, list);
    return article;
  },
  deleteArticle(id) {
    let list = this.getArticles();
    list = list.filter(a => a.id !== id);
    wx.setStorageSync(KEYS.ARTICLES, list);
    return list;
  }
};

module.exports = StorageService;
