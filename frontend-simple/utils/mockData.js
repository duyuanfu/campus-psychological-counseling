/**
 * 校园心理咨询平台 - 核心初始模拟数据
 */

// 用户角色定义
const ROLES = {
  STUDENT: 'student',
  COUNSELOR: 'counselor',
  ADMIN: 'admin'
};

// 预置账号
const DEFAULT_USERS = {
  student: {
    id: 'u_1001',
    role: 'student',
    name: '林微光',
    studentId: '2022030142',
    college: '数字媒体与设计学院',
    major: '数字媒体艺术',
    grade: '大二',
    phone: '138****6688',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    isCertified: true,
    privacySettings: {
      anonymousTreehole: true,
      hideRealNameFromCounselor: false,
      allowDataAnalysis: true
    }
  },
  counselor: {
    id: 'c_2001',
    role: 'counselor',
    name: '陈清心 教授',
    title: '国家二级心理咨询师 / 心理中心专职主任',
    qualification: '国家二级心理咨询师 (No.1802000045)',
    college: '学生心理健康教育与咨询中心',
    experience: '12年高校心理咨询经验',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
    rating: 4.95,
    consultCount: 1420,
    tags: ['情绪困扰', '学业焦虑', '亲密关系', '生涯规划'],
    intro: '认知行为疗法（CBT）及人本主义流派取向，致力于帮助青年学生发掘内在复原力，在倾听与接纳中共同找寻前行之光。',
    isCertified: true
  },
  admin: {
    id: 'a_3001',
    role: 'admin',
    name: '系统安全管理员',
    adminId: 'ADMIN-8080',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    dept: '学生处·心理健康危机干预委员会'
  }
};

// 心理咨询师列表
const COUNSELORS = [
  {
    id: 'c_2001',
    name: '陈清心',
    title: '副教授 / 国家二级心理咨询师',
    tagList: ['学业焦虑', '情绪舒缓', '自我探索'],
    college: '中心专职首席咨询师',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
    rating: 4.98,
    reviewsCount: 382,
    goodRate: '99.5%',
    location: '阳光校区 心理健康中心 302室 / 线上腾讯会议',
    availableModes: ['线下咨询', '线上视频', '语音连线'],
    intro: '国家二级心理咨询师，从业12年，擅长运用认知行为疗法（CBT）与正念减压，接纳每一个迷茫而真诚的心灵。',
    workHours: '周二至周五 09:00 - 17:30'
  },
  {
    id: 'c_2002',
    name: '沈景云',
    title: '心理学博士 / 注册心理师 (CPS)',
    tagList: ['人际关系', '亲密关系', '原生家庭'],
    college: '中国心理学会注册心理师 (X-20-112)',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    rating: 4.92,
    reviewsCount: 260,
    goodRate: '98.8%',
    location: '清枫校区 笃行楼 518室',
    availableModes: ['线下咨询', '线上视频'],
    intro: '动力学取向咨询师，德国催眠协会认证催眠师，擅长深层潜意识探索、人际边界建立及家庭创伤修复。',
    workHours: '周一、周三、周六 14:00 - 20:00'
  },
  {
    id: 'c_2003',
    name: '张沐阳',
    title: '资深青少年咨询师 / 叙事疗法专家',
    tagList: ['DDL拖延', '社交回避', '生涯迷茫'],
    college: '高校专职心理辅导员 / 督导师',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    rating: 4.89,
    reviewsCount: 195,
    goodRate: '98.2%',
    location: '阳光校区 心理健康中心 305室',
    availableModes: ['线下咨询', '线上视频', '文字倾诉'],
    intro: '叙事疗法实践者。相信每个人都是自身生命故事的作者，陪你解构标签、重构充满生命力的叙事框架。',
    workHours: '周一至周四 13:30 - 18:00'
  }
];

// 标准心理量表（SDS 抑郁自评量表 & SAS 焦虑自评量表）
const SCALES = [
  {
    id: 'sds',
    title: 'SDS 抑郁自评量表',
    code: 'SDS',
    subtitle: 'Self-Rating Depression Scale · Zung编制',
    desc: '国际通用的专业抑郁情绪筛查量表，通过20道典型身心表现，精准评估近一周内的抑郁倾向与情绪状态。',
    coverGradient: 'linear-gradient(135deg, #4A90E2, #50E3C2)',
    badge: '临床黄金标准',
    itemCount: 20,
    estimateMin: 5,
    testedCount: 12480,
    options: [
      { text: '没有或很少时间（过去一周少于1天）', score: 1 },
      { text: '有时有（过去一周有1-2天）', score: 2 },
      { text: '大部分时间有（过去一周有3-4天）', score: 3 },
      { text: '绝大部分或全部时间（过去一周有5-7天）', score: 4 }
    ],
    // 20道题题干及是否反向计分标记
    questions: [
      { id: 1, text: '我觉得闷闷不乐，情绪低沉', reverse: false, dim: '情绪低落' },
      { id: 2, text: '我觉得清晨最好（一天中感觉最好）', reverse: true, dim: '日夜节律' },
      { id: 3, text: '我一阵阵哭出来或觉得想哭', reverse: false, dim: '情绪低落' },
      { id: 4, text: '我晚上睡眠不好，常易惊醒或早醒', reverse: false, dim: '躯体障碍' },
      { id: 5, text: '我吃得和平时一样多（食欲好）', reverse: true, dim: '躯体障碍' },
      { id: 6, text: '我与异性交往时依然感到心情愉悦', reverse: true, dim: '情感感知' },
      { id: 7, text: '我感到体重在减轻', reverse: false, dim: '躯体障碍' },
      { id: 8, text: '我为便秘烦恼', reverse: false, dim: '躯体障碍' },
      { id: 9, text: '我心跳比平时快，感到心慌', reverse: false, dim: '精神运动' },
      { id: 10, text: '我无缘无故地感到疲乏无力', reverse: false, dim: '精神运动' },
      { id: 11, text: '我的头脑跟平常一样清楚', reverse: true, dim: '认知功能' },
      { id: 12, text: '我觉得做平常的事情并没有困难', reverse: true, dim: '认知功能' },
      { id: 13, text: '我坐卧不安，难以平静', reverse: false, dim: '精神运动' },
      { id: 14, text: '我对未来感到有希望和憧憬', reverse: true, dim: '绝望感' },
      { id: 15, text: '我比平时更容易激怒和烦躁', reverse: false, dim: '情绪低落' },
      { id: 16, text: '我觉得决定什么事很容易', reverse: true, dim: '认知功能' },
      { id: 17, text: '我觉得自己是个有用的人，有人需要我', reverse: true, dim: '自我价值' },
      { id: 18, text: '我的生活过得很有意思、充实', reverse: true, dim: '生活兴趣' },
      { id: 19, text: '我认为如果我死了别人会过得更好', reverse: false, dim: '危机风险' },
      { id: 20, text: '平常感兴趣的事我依然能感到乐趣', reverse: true, dim: '生活兴趣' }
    ]
  },
  {
    id: 'sas',
    title: 'SAS 焦虑自评量表',
    code: 'SAS',
    subtitle: 'Self-Rating Anxiety Scale · Zung编制',
    desc: '权威身心焦虑评估工具，用于测量主观焦虑症状及其在身体神经系统的躯体化反应。',
    coverGradient: 'linear-gradient(135deg, #FF6B8B, #FF8E53)',
    badge: '高校重点量表',
    itemCount: 20,
    estimateMin: 5,
    testedCount: 9650,
    options: [
      { text: '没有或很少时间', score: 1 },
      { text: '有时有', score: 2 },
      { text: '大部分时间有', score: 3 },
      { text: '绝大部分或全部时间', score: 4 }
    ],
    questions: [
      { id: 1, text: '我觉得比平时容易紧张和着急', reverse: false, dim: '焦虑心境' },
      { id: 2, text: '我无缘无故地感到害怕', reverse: false, dim: '焦虑心境' },
      { id: 3, text: '我容易心里发慌、心烦意乱或惊恐', reverse: false, dim: '焦虑心境' },
      { id: 4, text: '我觉得我可能要发疯或失控了', reverse: false, dim: '精神运动' },
      { id: 5, text: '我觉得一切都很好，没什么不幸会发生', reverse: true, dim: '安全感' },
      { id: 6, text: '我手脚发抖或打颤', reverse: false, dim: '躯体神经' },
      { id: 7, text: '我因为头痛、颈痛和背痛而苦恼', reverse: false, dim: '躯体神经' },
      { id: 8, text: '我感觉容易衰弱和疲乏', reverse: false, dim: '自主神经' },
      { id: 9, text: '我觉得心平气和，容易安静坐着', reverse: true, dim: '放松能力' },
      { id: 10, text: '我觉得心跳得很快，扑通扑通跳', reverse: false, dim: '自主神经' },
      { id: 11, text: '我因为阵阵头晕而苦恼', reverse: false, dim: '自主神经' },
      { id: 12, text: '我有晕倒发作，或觉得要晕倒似的', reverse: false, dim: '自主神经' },
      { id: 13, text: '我呼吸畅快、呼气吸气很自然', reverse: true, dim: '呼吸节律' },
      { id: 14, text: '我手脚麻木和刺痛', reverse: false, dim: '躯体神经' },
      { id: 15, text: '我因为胃痛和消化不良而苦恼', reverse: false, dim: '自主神经' },
      { id: 16, text: '我常常要小便', reverse: false, dim: '自主神经' },
      { id: 17, text: '我的手常常是干燥温暖的', reverse: true, dim: '自主神经' },
      { id: 18, text: '我脸红发热', reverse: false, dim: '自主神经' },
      { id: 19, text: '我容易入睡，并且一夜睡得良好', reverse: true, dim: '睡眠质量' },
      { id: 20, text: '我做恶梦，易从梦中惊醒', reverse: false, dim: '睡眠质量' }
    ]
  }
];

// 白噪音与声音疗愈库
const SOUND_TRACKS = [
  {
    id: 'rain',
    name: '屋檐细雨',
    tag: '舒缓深睡',
    icon: '🌧️',
    gradient: 'linear-gradient(135deg, #3A7BD5, #3a6073)',
    desc: '温柔水滴敲打青瓦，抚平浮躁焦灼的情绪',
    frequency: '粉红噪音 / 低频治愈'
  },
  {
    id: 'forest',
    name: '晨光林间',
    tag: '提神专注',
    icon: '🌲',
    gradient: 'linear-gradient(135deg, #11998E, #38EF7D)',
    desc: '穿行于薄雾冷杉间，聆听晨鸟与微风呢喃',
    frequency: '白噪音 / 432Hz共振'
  },
  {
    id: 'waves',
    name: '深海浪涌',
    tag: '情绪平静',
    icon: '🌊',
    gradient: 'linear-gradient(135deg, #2E3192, #1BFFFF)',
    desc: '潮汐退涨的节律，带走内心的重担与疲惫',
    frequency: '布朗噪音 / 冥想波动'
  },
  {
    id: 'campfire',
    name: '温热篝火',
    tag: '温暖安全',
    icon: '🔥',
    gradient: 'linear-gradient(135deg, #F857A6, #FF5858)',
    desc: '柴火偶尔爆裂的微响，如同置身温暖庇护所',
    frequency: '低频裂隙音 / 安全感'
  },
  {
    id: 'night',
    name: '夏夜星空',
    tag: '止息杂念',
    icon: '🌌',
    gradient: 'linear-gradient(135deg, #4E54C8, #8F94FB)',
    desc: '静谧旷野里的遥远微风与柔和虫鸣',
    frequency: '自然原声 / 放松入眠'
  }
];

// 心理科普文章
const ARTICLES = [
  {
    id: 'art_1',
    title: '面对期末与DDL焦虑：你不是不够自律，而是太累了',
    category: '学业与成长',
    cover: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=500',
    readCount: 3420,
    likesCount: 285,
    author: '心理中心 陈清心',
    date: '2025-05-18',
    summary: '很多人把拖延归结为意志力薄弱，但神经科学研究发现：拖延本质上是对负面情绪的逃避。教你3步切断内耗回路。',
    content: [
      '你是否经常有这样的体会：明明知道论文还有两天就截止，PPT还没动一个字，却还是控制不住地刷新社交媒体？',
      '心理学研究表明：【拖延不是时间管理问题，而是情绪调节问题】。当我们潜意识里将某项任务与“害怕失败”、“追求完美”、“无力感”等消极情绪绑定时，大脑的杏仁核会启动“战或逃”反应，促使我们逃向即时满足感。',
      '🌟 3个实操应对法则：',
      '1. 「降级启动」：不要对自己说“我要写完整篇5000字论文”，而是“我只打开Word写第一段30个字”，降低大脑防御；',
      '2. 「接纳不完美的草稿」：先完成、再完美；允许第一稿写得很烂；',
      '3. 「5分钟番茄呼吸」：在焦虑濒临崩溃时，离开桌面进行2分钟4-7-8呼吸，让前额叶重新掌握控制权。'
    ]
  },
  {
    id: 'art_2',
    title: '讨好型人格自救指南：把别人的课题还给别人',
    category: '人际沟通',
    cover: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=500',
    readCount: 2890,
    likesCount: 312,
    author: '心理中心 沈景云',
    date: '2025-05-12',
    summary: '不敢拒绝室友的求助？害怕别人不开心？学会「课题分离」，建立健康的心理边界。',
    content: [
      '“我如果不帮她，她会不会在宿舍孤立我？”——在大学的人际交往中，许多敏感的同学常常为他人的情绪买单。',
      '阿德勒心理学提出核心概念【课题分离】：任何人的一切烦恼，皆源于人际关系；而解决之道，就是分清楚“这是谁的课题”。',
      '🌟 建立健康边界的行动指南：',
      '• 对方提要求是对方的自由，但同意与否是你的权利；',
      '• 对方若因你的真诚拒绝感到生气，那是对方面对挫败情绪的课题，并非你的过失；',
      '• 试着用温和而坚定的话术练习拒绝：“这件事情我目前时间和精力确实不太方便，感谢你的理解。”'
    ]
  },
  {
    id: 'art_3',
    title: '精神内耗停止法：写情绪日记为何真的有效？',
    category: '自我觉察',
    cover: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=500',
    readCount: 1980,
    likesCount: 176,
    author: '心理中心 张沐阳',
    date: '2025-05-08',
    summary: '把情绪转化为具象文字，能激活大脑左半球的理性分析能力，从根本上弱化情绪风暴。',
    content: [
      '当大脑陷入反刍思维（Rumination）时，思维会在痛苦的循环中不断强化。',
      '通过每天记录5分钟情绪日记，我们正在做一件神奇的事：将抽象汹涌的情感体验“客体化”。一旦痛苦被写在纸上或记录在屏幕中，你就不再是痛苦本身，而是观察痛苦的见证者。'
    ]
  }
];

// 匿名树洞初始贴文
const TREEHOLE_POSTS = [
  {
    id: 'th_01',
    anonymousName: '微风中的银杏',
    avatarTag: '🍂',
    avatarColor: '#FA8C16',
    timeDesc: '10分钟前',
    tag: '学业困惑',
    content: '大二的专业课越来越深，今天做数字音频工程被卡了整整五个小时...看着身边的同学一个个交了优秀作业，突然好想回老家，感觉自己好渺小又好挫败。',
    hugCount: 38,
    isHugged: false,
    commentCount: 5,
    comments: [
      { id: 'c1', user: '深海的蓝鲸', avatarTag: '🐋', text: '抱抱你！我也学数媒的，大二真的最容易迷茫，别跟别人比进度，你今天坚持了5小时就已经超级棒了！', time: '8分钟前' },
      { id: 'c2', user: '草莓味小熊', avatarTag: '🧸', text: '学累了去操场散散步吃根烤肠吧！明天又是新的开始~', time: '5分钟前' }
    ]
  },
  {
    id: 'th_02',
    anonymousName: '向日葵的晴天',
    avatarTag: '🌻',
    avatarColor: '#FADB14',
    timeDesc: '45分钟前',
    tag: '人际关系',
    content: '今天终于鼓起勇气拒绝了室友让我带一周外卖的要求。虽然说出口的那瞬间心跳得快要从嗓子眼蹦出来，但回到宿舍发现其实也没发生什么可怕的事！我终于开始学会爱自己了。🎉',
    hugCount: 82,
    isHugged: true,
    commentCount: 7,
    comments: [
      { id: 'c3', user: '暖阳小鹿', avatarTag: '🦌', text: '太棒了！！为你感到骄傲！跨出这一步以后世界会轻松很多！', time: '30分钟前' }
    ]
  },
  {
    id: 'th_03',
    anonymousName: '星夜里的潜水艇',
    avatarTag: '⭐',
    avatarColor: '#722ED1',
    timeDesc: '2小时前',
    tag: '求助求抱抱',
    content: '连续一周失眠到凌晨四点，白天头痛欲裂，觉得无论怎么努力都达不到家里的期望。很想找人聊聊，心理中心的预约排期大家试过吗？',
    hugCount: 56,
    isHugged: false,
    commentCount: 4,
    comments: [
      { id: 'c4', user: '晨曦白鸽', avatarTag: '🕊️', text: '同学你好，直接在咱们小程序预约陈清心老师或者沈老师都很温柔！也可以先试下首页的呼吸训练，抱紧你！', time: '1小时前' }
    ]
  }
];

// 预警学生名单（供咨询师端与管理员端监控）
const CRISIS_ALERTS = [
  {
    id: 'alert_101',
    studentId: '2023010998',
    studentName: '赵*涵',
    gender: '女',
    college: '计算机科学与技术学院',
    grade: '大一',
    phone: '139****1122',
    level: 'red', // red: 重度高危, yellow: 中度预警
    levelName: '重度红色预警',
    triggerReason: 'SDS抑郁自评量表标准分81分（重度抑郁）+ 测评第19题高危筛查阳性',
    triggerTime: '2025-05-20 14:22',
    scaleScore: 81,
    status: 'pending', // pending: 待干预, handling: 干预中, resolved: 已化解
    counselorInCharge: '陈清心',
    notes: '已由学院辅导员电话联系，情绪低落，建议当天下午线下紧急面谈评估。'
  },
  {
    id: 'alert_102',
    studentId: '2021020431',
    studentName: '周*宇',
    gender: '男',
    college: '经济管理学院',
    grade: '大三',
    phone: '188****7788',
    level: 'yellow',
    levelName: '中度黄色预警',
    triggerReason: 'SAS焦虑自评量表标准分68分（中度焦虑）且树洞言论表达持续躯体化惊恐',
    triggerTime: '2025-05-19 20:15',
    scaleScore: 68,
    status: 'handling',
    counselorInCharge: '沈景云',
    notes: '已进行一次线上情绪安抚，已预约周三面对面认知疏导。'
  }
];

// 预置预约列表
const INITIAL_APPOINTMENTS = [
  {
    id: 'apt_5001',
    studentId: 'u_1001',
    studentName: '林微光',
    studentPhone: '138****6688',
    counselorId: 'c_2001',
    counselorName: '陈清心',
    counselorTitle: '副教授 / 国家二级心理咨询师',
    date: '2025-05-26',
    timeSlot: '14:30 - 15:30',
    mode: '线下咨询',
    location: '阳光校区 心理健康中心 302室',
    problemCategory: '学业与前途焦虑',
    description: '近期面对期末作业及考研压力，经常陷入内耗拖延，难以专注，希望能做认知疏导。',
    status: 'confirmed', // pending: 待审核, confirmed: 已确认, completed: 已完成, rejected: 已驳回, canceled: 已取消
    statusText: '已确认预约',
    feedbackNotes: '已安排302个案咨询室，请提前5分钟到达，保持轻松心情。'
  },
  {
    id: 'apt_5002',
    studentId: 'u_1001',
    studentName: '林微光',
    studentPhone: '138****6688',
    counselorId: 'c_2002',
    counselorName: '沈景云',
    counselorTitle: '心理学博士 / 注册心理师',
    date: '2025-05-10',
    timeSlot: '16:00 - 17:00',
    mode: '线下咨询',
    location: '清枫校区 笃行楼 518室',
    problemCategory: '人际交往沟通',
    description: '和室友相处产生误解，不知道该如何表达自己的想法。',
    status: 'completed',
    statusText: '咨询已完成',
    feedbackNotes: '已完成单次咨询，学生情绪明显好转，给出了自我表达练习建议。'
  }
];

// 预置咨询师咨询记录
const COUNSELING_RECORDS = [
  {
    id: 'rec_801',
    appointmentId: 'apt_5002',
    studentId: 'u_1001',
    studentName: '林微光',
    studentMajor: '数字媒体艺术 大二',
    counselorId: 'c_2001',
    counselorName: '陈清心',
    consultDate: '2025-05-10',
    duration: '50分钟',
    type: '个体心理咨询',
    riskLevel: '低风险 (常规)',
    mentalStatus: '神志清晰，思维连贯，言语稍有压抑，眼眶微润，无幻觉及自伤意向。',
    complaintSummary: '来访者主诉近两周与舍友关系微妙，常因担心被孤立而违背自身意愿满足他人，伴随入睡延迟与轻度胸闷。',
    assessmentResult: '适应不良型人际困扰，存在讨好倾向及过度负责的认知扭曲。人格底色较健康，求助意愿强烈。',
    interventionStrategy: '1. 采用人本主义给予充分共情与接纳；2. 引入阿德勒课题分离理念；3. 布置情景边界练习作业。',
    followupPlan: '观察一周自我日记记录，若有复发必要可再次预约。'
  }
];

// 预置情绪日记
const INITIAL_MOOD_DIARIES = [
  {
    id: 'mood_1',
    date: '2025-05-21',
    dayStr: '今天',
    moodScore: 4, // 1~5
    moodIcon: '😊',
    moodText: '平静舒心',
    tags: ['完成了论文大纲', '操场慢跑3公里', '听了白噪音'],
    content: '今天跟着呼吸训练练习了十分钟，终于平静下来把卡了三天的模型做完了。其实事情没想象中那么难！'
  },
  {
    id: 'mood_2',
    date: '2025-05-20',
    dayStr: '昨天',
    moodScore: 2,
    moodIcon: '🌧️',
    moodText: '有些焦虑',
    tags: ['DDL逼近', '睡眠不佳'],
    content: '昨晚两点多才睡着，早上起来头脑昏昏沉沉，对自己有点不满意。'
  },
  {
    id: 'mood_3',
    date: '2025-05-18',
    dayStr: '3天前',
    moodScore: 5,
    moodIcon: '✨',
    moodText: '充满能量',
    tags: ['喝了热奶茶', '和朋友散步', '阳光明媚'],
    content: '下午在图书馆靠窗的位置看书，阳光照在身上暖洋洋的，感觉生活还是有很多值得期待的美好。'
  }
];

// 预置历史测评报告
const INITIAL_ASSESSMENT_REPORTS = [
  {
    id: 'rep_1',
    scaleId: 'sds',
    scaleTitle: 'SDS 抑郁自评量表',
    date: '2025-05-18 16:30',
    rawScore: 38,
    standardScore: 48,
    level: 'normal',
    levelTitle: '正常状态 (无抑郁倾向)',
    levelColor: '#52C41A',
    dimensionScores: [
      { name: '情绪低落', score: 35, full: 100 },
      { name: '躯体障碍', score: 45, full: 100 },
      { name: '精神运动', score: 40, full: 100 },
      { name: '认知功能', score: 25, full: 100 },
      { name: '自我价值', score: 30, full: 100 },
      { name: '绝望风险', score: 0, full: 100 }
    ],
    analysis: '您的SDS标准分为48分（低于53分常模临界值），表明您目前心理情绪处于良好稳定的健康区间。虽然偶有学业压力引发的疲劳，但具备良好的自我心理调节和复原能力。',
    suggestions: [
      '继续保持规律作息和每周适度有氧运动；',
      '在学业任务密集时合理规划时间，避免长时间连续高压；',
      '当有微小烦恼时，可以继续使用“情绪日记”或“呼吸训练”舒压。'
    ]
  }
];

module.exports = {
  ROLES,
  DEFAULT_USERS,
  COUNSELORS,
  SCALES,
  SOUND_TRACKS,
  ARTICLES,
  TREEHOLE_POSTS,
  CRISIS_ALERTS,
  INITIAL_APPOINTMENTS,
  COUNSELING_RECORDS,
  INITIAL_MOOD_DIARIES,
  INITIAL_ASSESSMENT_REPORTS
};
