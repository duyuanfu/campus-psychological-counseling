-- ========================================================
-- 高校心理健康咨询与数字媒体交互平台 (MySQL 数据库脚本)
-- 包含完整的表结构与初始种子数据
-- ========================================================

CREATE DATABASE IF NOT EXISTS `campus_psychology` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `campus_psychology`;

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- 1. 用户基础表 (sys_user)
DROP TABLE IF EXISTS `sys_user`;
CREATE TABLE `sys_user` (
  `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `username` VARCHAR(50) NOT NULL COMMENT '登录账号/用户名',
  `password` VARCHAR(100) NOT NULL COMMENT '加密密码',
  `role` VARCHAR(20) NOT NULL COMMENT '身份角色: STUDENT, COUNSELOR, ADMIN',
  `name` VARCHAR(50) NOT NULL COMMENT '真实姓名',
  `phone` VARCHAR(20) DEFAULT NULL COMMENT '联系手机',
  `avatar` VARCHAR(255) DEFAULT NULL COMMENT '头像URL',
  `status` VARCHAR(20) DEFAULT 'ACTIVE' COMMENT '状态: ACTIVE, PENDING, DISABLED',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户基础信息表';

-- 2. 学生档案拓展表 (student_profile)
DROP TABLE IF EXISTS `student_profile`;
CREATE TABLE `student_profile` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `user_id` BIGINT NOT NULL COMMENT '关联sys_user表ID',
  `student_id` VARCHAR(50) NOT NULL COMMENT '学号',
  `college` VARCHAR(100) DEFAULT NULL COMMENT '学院',
  `major` VARCHAR(100) DEFAULT NULL COMMENT '专业',
  `grade` VARCHAR(50) DEFAULT NULL COMMENT '年级 (如: 大二)',
  `emergency_contact` VARCHAR(50) DEFAULT NULL COMMENT '紧急联络人',
  `emergency_phone` VARCHAR(50) DEFAULT NULL COMMENT '紧急联络电话',
  `is_certified` TINYINT(1) DEFAULT 1 COMMENT '是否通过认证: 1-已认证, 0-待认证',
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='学生专属档案扩展表';

-- 3. 咨询师档案拓展表 (counselor_profile)
DROP TABLE IF EXISTS `counselor_profile`;
CREATE TABLE `counselor_profile` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `user_id` BIGINT NOT NULL COMMENT '关联sys_user表ID',
  `title` VARCHAR(100) DEFAULT NULL COMMENT '职称',
  `qualification` VARCHAR(255) DEFAULT NULL COMMENT '国家执业资质',
  `college` VARCHAR(100) DEFAULT NULL COMMENT '所在机构/部门',
  `experience` VARCHAR(100) DEFAULT NULL COMMENT '从业资历',
  `rating` DECIMAL(3,2) DEFAULT 4.90 COMMENT '综合评分',
  `consult_count` INT DEFAULT 0 COMMENT '咨询人次',
  `tags` VARCHAR(255) DEFAULT NULL COMMENT '擅长领域标签(逗号分隔)',
  `intro` TEXT COMMENT '专业背景简介',
  `location` VARCHAR(255) DEFAULT NULL COMMENT '咨询室地址',
  `available_modes` VARCHAR(100) DEFAULT '线下咨询,线上视频' COMMENT '支持形式',
  `work_hours` VARCHAR(100) DEFAULT NULL COMMENT '工作时间描述',
  PRIMARY KEY (`id`),
  KEY `idx_counselor_user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='咨询师档案扩展表';

-- 4. 咨询师每周排班表 (counselor_schedule)
DROP TABLE IF EXISTS `counselor_schedule`;
CREATE TABLE `counselor_schedule` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `counselor_user_id` BIGINT NOT NULL COMMENT '咨询师User ID',
  `available_days` VARCHAR(255) DEFAULT '周二,周三,周四,周五' COMMENT '开放星期(逗号分隔)',
  `time_slots` TEXT COMMENT '开放时段(逗号分隔)',
  `max_per_day` INT DEFAULT 4 COMMENT '每日最大接待人数',
  PRIMARY KEY (`id`),
  KEY `idx_sched_user` (`counselor_user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='咨询师每周排班表';

-- 5. 在线预约表 (appointment)
DROP TABLE IF EXISTS `appointment`;
CREATE TABLE `appointment` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `student_user_id` BIGINT NOT NULL COMMENT '学生User ID',
  `student_name` VARCHAR(50) NOT NULL COMMENT '学生姓名',
  `student_phone` VARCHAR(20) DEFAULT NULL,
  `emergency_phone` VARCHAR(20) DEFAULT NULL,
  `counselor_user_id` BIGINT NOT NULL COMMENT '咨询师User ID',
  `counselor_name` VARCHAR(50) NOT NULL,
  `counselor_title` VARCHAR(100) DEFAULT NULL,
  `consult_date` VARCHAR(20) NOT NULL COMMENT '预约日期 YYYY-MM-DD',
  `time_slot` VARCHAR(50) NOT NULL COMMENT '预约时段',
  `mode` VARCHAR(50) DEFAULT '线下咨询' COMMENT '咨询方式',
  `location` VARCHAR(255) DEFAULT NULL COMMENT '咨询室或腾讯会议',
  `problem_category` VARCHAR(100) DEFAULT NULL COMMENT '诉求议题',
  `description` TEXT COMMENT '主诉详述',
  `status` VARCHAR(20) DEFAULT 'PENDING' COMMENT 'PENDING, CONFIRMED, COMPLETED, REJECTED, CANCELED',
  `feedback_notes` TEXT COMMENT '反馈/驳回理由/注意事项',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_apt_student` (`student_user_id`),
  KEY `idx_apt_counselor` (`counselor_user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='心理咨询预约表';

-- 6. 心理测评记录表 (assessment_record)
DROP TABLE IF EXISTS `assessment_record`;
CREATE TABLE `assessment_record` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `student_user_id` BIGINT NOT NULL,
  `scale_id` VARCHAR(50) NOT NULL COMMENT 'sds, sas',
  `scale_title` VARCHAR(100) NOT NULL,
  `raw_score` INT NOT NULL,
  `standard_score` INT NOT NULL,
  `level` VARCHAR(20) NOT NULL COMMENT 'normal, mild, moderate, severe',
  `level_title` VARCHAR(50) NOT NULL,
  `dimension_scores` TEXT COMMENT '雷达图多维得分JSON',
  `analysis` TEXT COMMENT '解读说明',
  `suggestions` TEXT COMMENT '调适建议JSON',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_ass_student` (`student_user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='心理健康测评报告记录表';

-- 7. 匿名树洞贴子表 (treehole_post)
DROP TABLE IF EXISTS `treehole_post`;
CREATE TABLE `treehole_post` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `user_id` BIGINT NOT NULL COMMENT '发布者User ID',
  `anonymous_name` VARCHAR(50) NOT NULL COMMENT '匿名化身名',
  `avatar_tag` VARCHAR(10) DEFAULT '🌻' COMMENT 'emoji图标',
  `avatar_color` VARCHAR(20) DEFAULT '#FA8C16',
  `tag` VARCHAR(50) NOT NULL COMMENT '话题分类',
  `content` TEXT NOT NULL COMMENT '倾诉正文',
  `hug_count` INT DEFAULT 0 COMMENT '抱抱数',
  `status` VARCHAR(20) DEFAULT 'NORMAL' COMMENT 'NORMAL, APPROVED, VIOLATION',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='匿名树洞内容表';

-- 8. 树洞评论回音表 (treehole_comment)
DROP TABLE IF EXISTS `treehole_comment`;
CREATE TABLE `treehole_comment` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `post_id` BIGINT NOT NULL,
  `user_id` BIGINT NOT NULL,
  `anonymous_name` VARCHAR(50) DEFAULT '温暖同路人',
  `content` TEXT NOT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_cmt_post` (`post_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='树洞评论回复表';

-- 9. 情绪日记表 (mood_diary)
DROP TABLE IF EXISTS `mood_diary`;
CREATE TABLE `mood_diary` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `student_user_id` BIGINT NOT NULL,
  `date` VARCHAR(20) NOT NULL,
  `mood_score` INT NOT NULL COMMENT '1-5分',
  `mood_icon` VARCHAR(10) NOT NULL,
  `mood_text` VARCHAR(50) NOT NULL,
  `tags` VARCHAR(255) DEFAULT NULL,
  `content` TEXT,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_mood_student` (`student_user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='情绪日记记录表';

-- 10. 危机预警与干预表 (crisis_alert)
DROP TABLE IF EXISTS `crisis_alert`;
CREATE TABLE `crisis_alert` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `student_user_id` BIGINT DEFAULT NULL,
  `student_name` VARCHAR(50) NOT NULL,
  `college` VARCHAR(100) DEFAULT NULL,
  `grade` VARCHAR(50) DEFAULT NULL,
  `phone` VARCHAR(20) DEFAULT NULL,
  `level` VARCHAR(20) NOT NULL COMMENT 'red, yellow',
  `level_name` VARCHAR(50) NOT NULL,
  `trigger_reason` TEXT NOT NULL,
  `trigger_time` VARCHAR(50) NOT NULL,
  `scale_score` INT DEFAULT NULL,
  `status` VARCHAR(20) DEFAULT 'PENDING' COMMENT 'PENDING, HANDLING, RESOLVED',
  `counselor_in_charge` VARCHAR(50) DEFAULT NULL,
  `notes` TEXT,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='心理危机预警处置闭环表';

-- 11. 心理咨询个案记录表 (counseling_record)
DROP TABLE IF EXISTS `counseling_record`;
CREATE TABLE `counseling_record` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `appointment_id` BIGINT DEFAULT NULL,
  `student_user_id` BIGINT DEFAULT NULL,
  `student_name` VARCHAR(50) NOT NULL,
  `student_major` VARCHAR(100) DEFAULT NULL,
  `counselor_name` VARCHAR(50) NOT NULL,
  `consult_date` VARCHAR(20) NOT NULL,
  `duration` VARCHAR(50) DEFAULT '50分钟',
  `type` VARCHAR(50) DEFAULT '个体心理咨询',
  `risk_level` VARCHAR(50) DEFAULT '常规 (低风险)',
  `mental_status` TEXT COMMENT '来访者精神状态检查',
  `complaint_summary` TEXT COMMENT '主诉与谈话摘要',
  `assessment_result` TEXT COMMENT '评估结论与认知诊断',
  `intervention_strategy` TEXT COMMENT '干预策略与作业',
  `followup_plan` TEXT COMMENT '后续随访计划',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='心理咨询个案档案记录表';

-- 12. 心理科普文章表 (article)
DROP TABLE IF EXISTS `article`;
CREATE TABLE `article` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(200) NOT NULL,
  `category` VARCHAR(50) NOT NULL,
  `cover` VARCHAR(255) DEFAULT NULL,
  `read_count` INT DEFAULT 0,
  `likes_count` INT DEFAULT 0,
  `author` VARCHAR(50) NOT NULL,
  `date` VARCHAR(20) NOT NULL,
  `summary` TEXT,
  `content` TEXT,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='心理科普文章表';

-- ========================================================
-- 初始种子数据导入
-- ========================================================

-- 初始用户 (密码统一为 123456)
INSERT INTO `sys_user` (`id`, `username`, `password`, `role`, `name`, `phone`, `avatar`, `status`) VALUES
(1, 'student', '123456', 'STUDENT', '林微光', '13800138000', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', 'ACTIVE'),
(2, 'counselor', '123456', 'COUNSELOR', '陈清心', '13900139000', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150', 'ACTIVE'),
(3, 'counselor2', '123456', 'COUNSELOR', '沈景云', '13900139002', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', 'ACTIVE'),
(4, 'counselor3', '123456', 'COUNSELOR', '张沐阳', '13900139003', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', 'ACTIVE'),
(5, 'admin', '123456', 'ADMIN', '系统安全管理员', '13700137000', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150', 'ACTIVE');

-- 学生扩展档案
INSERT INTO `student_profile` (`id`, `user_id`, `student_id`, `college`, `major`, `grade`, `emergency_contact`, `emergency_phone`, `is_certified`) VALUES
(1, 1, '2022030142', '数字媒体与设计学院', '数字媒体艺术', '大二', '林父', '13900138999', 1);

-- 咨询师扩展档案
INSERT INTO `counselor_profile` (`id`, `user_id`, `title`, `qualification`, `college`, `experience`, `rating`, `consult_count`, `tags`, `intro`, `location`, `available_modes`, `work_hours`) VALUES
(1, 2, '副教授 / 国家二级心理咨询师', '国家二级心理咨询师 (No.1802000045)', '学生心理健康教育与咨询中心', '12年高校心理咨询经验', 4.98, 1420, '学业焦虑,情绪舒缓,自我探索', '认知行为疗法（CBT）及人本主义流派取向，致力于帮助青年学生发掘内在复原力。', '阳光校区 心理健康中心 302室', '线下咨询,线上视频,语音连线', '周二至周五 09:00 - 17:30'),
(2, 3, '心理学博士 / 注册心理师 (CPS)', '中国心理学会注册心理师 (X-20-112)', '心理咨询中心特聘专职', '8年心理咨询经验', 4.92, 860, '人际关系,亲密关系,原生家庭', '动力学取向咨询师，擅长深层潜意识探索、人际边界建立及家庭创伤修复。', '清枫校区 笃行楼 518室', '线下咨询,线上视频', '周一、周三、周六 14:00 - 20:00'),
(3, 4, '资深青少年咨询师 / 叙事疗法专家', '高校专职心理辅导员 / 督导师', '学生工作处', '10年高校心理咨询经验', 4.89, 630, 'DDL拖延,社交回避,生涯迷茫', '叙事疗法实践者。相信每个人都是自身生命故事的作者，陪你重构充满生命力的叙事框架。', '阳光校区 心理健康中心 305室', '线下咨询,线上视频,文字倾诉', '周一至周四 13:30 - 18:00');

-- 咨询师排班
INSERT INTO `counselor_schedule` (`id`, `counselor_user_id`, `available_days`, `time_slots`, `max_per_day`) VALUES
(1, 2, '周二,周三,周四,周五', '09:00 - 10:00,10:30 - 11:30,14:30 - 15:30,16:00 - 17:00', 4),
(2, 3, '周一,周三,周六', '14:00 - 15:00,15:30 - 16:30,18:30 - 19:30', 3),
(3, 4, '周一,周二,周三,周四', '13:30 - 14:30,15:00 - 16:00,16:30 - 17:30', 3);

-- 初始预约记录
INSERT INTO `appointment` (`id`, `student_user_id`, `student_name`, `student_phone`, `counselor_user_id`, `counselor_name`, `counselor_title`, `consult_date`, `time_slot`, `mode`, `location`, `problem_category`, `description`, `status`, `feedback_notes`) VALUES
(1, 1, '林微光', '13800138000', 2, '陈清心', '副教授 / 国家二级心理咨询师', '2025-05-26', '14:30 - 15:30', '线下咨询', '阳光校区 心理健康中心 302室', '学业与前途焦虑', '近期面对期末作业及考研压力，经常陷入内耗拖延，难以专注，希望能做认知疏导。', 'CONFIRMED', '已安排302个案咨询室，请提前5分钟到达，保持轻松心情。');

-- 初始科普文章
INSERT INTO `article` (`id`, `title`, `category`, `cover`, `read_count`, `likes_count`, `author`, `date`, `summary`, `content`) VALUES
(1, '面对期末与DDL焦虑：你不是不够自律，而是太累了', '学业与成长', 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=500', 3420, 285, '陈清心 教授', '2025-05-18', '很多人把拖延归结为意志力薄弱，但神经科学研究发现：拖延本质上是对负面情绪的逃避。教你3步切断内耗回路。', '你是否经常有这样的体会：明明知道论文还有两天就截止，PPT还没动一个字，却还是控制不住地刷新社交媒体？\n心理学研究表明：【拖延不是时间管理问题，而是情绪调节问题】。当我们潜意识里将某项任务与“害怕失败”、“追求完美”、“无力感”等消极情绪绑定时，大脑的杏仁核会启动“战或逃”反应，促使我们逃向即时满足感。\n🌟 3个实操应对法则：\n1. 「降级启动」：不要对自己说“我要写完整篇5000字论文”，而是“我只打开Word写第一段30个字”，降低大脑防御；\n2. 「接纳不完美的草稿」：先完成、再完美；允许第一稿写得很烂；\n3. 「5分钟番茄呼吸」：在焦虑濒临崩溃时，离开桌面进行2分钟4-7-8呼吸，让前额叶重新掌握控制权。'),
(2, '讨好型人格自救指南：把别人的课题还给别人', '人际沟通', 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=500', 2890, 312, '沈景云 博士', '2025-05-12', '不敢拒绝室友的求助？害怕别人不开心？学会「课题分离」，建立健康的心理边界。', '在大学的人际交往中，许多敏感的同学常常为他人的情绪买单。\n阿德勒心理学提出核心概念【课题分离】：任何人的一切烦恼，皆源于人际关系；而解决之道，就是分清楚“这是谁的课题”。\n• 对方提要求是对方的自由，但同意与否是你的权利；\n• 对方若因你的真诚拒绝感到生气，那是对方面对挫败情绪的课题，并非你的过失；\n• 试着用温和而坚定的话术练习拒绝：“这件事情我目前时间和精力确实不太方便，感谢你的理解。”');

-- 初始树洞发帖
INSERT INTO `treehole_post` (`id`, `user_id`, `anonymous_name`, `avatar_tag`, `avatar_color`, `tag`, `content`, `hug_count`, `status`) VALUES
(1, 1, '微风中的银杏', '🍂', '#FA8C16', '学业困惑', '大二的专业课越来越深，今天做数字音频工程被卡了整整五个小时...看着身边的同学一个个交了优秀作业，突然好想回老家，感觉自己好渺小又好挫败。', 38, 'NORMAL'),
(2, 1, '向日葵的晴天', '🌻', '#FADB14', '人际关系', '今天终于鼓起勇气拒绝了室友让我带一周外卖的要求。虽然说出口的那瞬间心跳得快要从嗓子眼蹦出来，但回到宿舍发现其实也没发生什么可怕的事！我终于开始学会爱自己了。🎉', 82, 'NORMAL');

-- 初始危机预警
INSERT INTO `crisis_alert` (`id`, `student_user_id`, `student_name`, `college`, `grade`, `phone`, `level`, `level_name`, `trigger_reason`, `trigger_time`, `scale_score`, `status`, `counselor_in_charge`, `notes`) VALUES
(1, 1, '赵*涵', '计算机科学与技术学院', '大一', '13900001122', 'red', '重度红色预警', 'SDS抑郁自评量表标准分81分（重度抑郁）+ 测评第19题高危筛查阳性', '2025-05-20 14:22', 81, 'PENDING', '陈清心', '已由学院辅导员电话联系，情绪低落，建议当天下午线下紧急面谈评估。');

SET FOREIGN_KEY_CHECKS = 1;
