package com.campus.psychology;

import com.campus.psychology.entity.*;
import com.campus.psychology.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import java.math.BigDecimal;

@SpringBootApplication
public class CampusPsychologyApplication {

    public static void main(String[] args) {
        SpringApplication.run(CampusPsychologyApplication.class, args);
        System.out.println("\n========================================================");
        System.out.println("  心语树·高校心理健康咨询平台后端服务已成功启动！");
        System.out.println("  接口服务地址: http://localhost:8088");
        System.out.println("  数据库模式: MySQL 数据库");
        System.out.println("========================================================\n");
    }

    @Bean
    public CommandLineRunner initDefaultData(UserRepository userRepository,
                                             StudentProfileRepository studentProfileRepository,
                                             CounselorProfileRepository counselorProfileRepository,
                                             CounselorScheduleRepository counselorScheduleRepository,
                                             ArticleRepository articleRepository,
                                             TreeholePostRepository treeholePostRepository,
                                             AppointmentRepository appointmentRepository,
                                             CrisisAlertRepository crisisAlertRepository) {
        return args -> {
            try {
                if (userRepository.count() == 0) {
                    System.out.println(">>> 数据库为空，正在初始化默认种子数据...");

                    // 1. 学生默认账号 (林微光)
                    User student = new User();
                    student.setUsername("student");
                    student.setPassword("123456");
                    student.setRole("STUDENT");
                    student.setName("林微光");
                    student.setPhone("13800138000");
                    student.setAvatar("https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150");
                    User savedStudent = userRepository.save(student);

                    StudentProfile sp = new StudentProfile();
                    sp.setUserId(savedStudent.getId());
                    sp.setStudentId("2022030142");
                    sp.setCollege("数字媒体与设计学院");
                    sp.setMajor("数字媒体艺术");
                    sp.setGrade("大二");
                    sp.setEmergencyContact("林父");
                    sp.setEmergencyPhone("13900138999");
                    sp.setIsCertified(true);
                    studentProfileRepository.save(sp);

                    // 2. 咨询师默认账号 (陈清心)
                    User counselor = new User();
                    counselor.setUsername("counselor");
                    counselor.setPassword("123456");
                    counselor.setRole("COUNSELOR");
                    counselor.setName("陈清心");
                    counselor.setPhone("13900139000");
                    counselor.setAvatar("https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150");
                    User savedCounselor = userRepository.save(counselor);

                    CounselorProfile cp = new CounselorProfile();
                    cp.setUserId(savedCounselor.getId());
                    cp.setTitle("副教授 / 国家二级心理咨询师");
                    cp.setQualification("国家二级心理咨询师 (No.1802000045)");
                    cp.setCollege("学生心理健康教育与咨询中心");
                    cp.setExperience("12年高校心理咨询经验");
                    cp.setRating(new BigDecimal("4.98"));
                    cp.setConsultCount(1420);
                    cp.setTags("学业焦虑,情绪舒缓,自我探索");
                    cp.setIntro("认知行为疗法（CBT）及人本主义流派取向，致力于帮助青年学生发掘内在复原力。");
                    cp.setLocation("阳光校区 心理健康中心 302室");
                    cp.setAvailableModes("线下咨询,线上视频,语音连线");
                    cp.setWorkHours("周二至周五 09:00 - 17:30");
                    counselorProfileRepository.save(cp);

                    CounselorSchedule cs = new CounselorSchedule();
                    cs.setCounselorUserId(savedCounselor.getId());
                    cs.setAvailableDays("周二,周三,周四,周五");
                    cs.setTimeSlots("09:00 - 10:00,10:30 - 11:30,14:30 - 15:30,16:00 - 17:00");
                    cs.setMaxPerDay(4);
                    counselorScheduleRepository.save(cs);

                    // 3. 第二位咨询师 (沈景云)
                    User counselor2 = new User();
                    counselor2.setUsername("counselor2");
                    counselor2.setPassword("123456");
                    counselor2.setRole("COUNSELOR");
                    counselor2.setName("沈景云");
                    counselor2.setPhone("13900139002");
                    counselor2.setAvatar("https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150");
                    User savedCounselor2 = userRepository.save(counselor2);

                    CounselorProfile cp2 = new CounselorProfile();
                    cp2.setUserId(savedCounselor2.getId());
                    cp2.setTitle("心理学博士 / 注册心理师 (CPS)");
                    cp2.setQualification("中国心理学会注册心理师 (X-20-112)");
                    cp2.setCollege("心理咨询中心特聘专职");
                    cp2.setExperience("8年心理咨询经验");
                    cp2.setRating(new BigDecimal("4.92"));
                    cp2.setConsultCount(860);
                    cp2.setTags("人际关系,亲密关系,原生家庭");
                    cp2.setIntro("动力学取向咨询师，擅长深层潜意识探索、人际边界建立及家庭创伤修复。");
                    cp2.setLocation("清枫校区 笃行楼 518室");
                    cp2.setAvailableModes("线下咨询,线上视频");
                    cp2.setWorkHours("周一、周三、周六 14:00 - 20:00");
                    counselorProfileRepository.save(cp2);

                    CounselorSchedule cs2 = new CounselorSchedule();
                    cs2.setCounselorUserId(savedCounselor2.getId());
                    cs2.setAvailableDays("周一,周三,周六");
                    cs2.setTimeSlots("14:00 - 15:00,15:30 - 16:30,18:30 - 19:30");
                    cs2.setMaxPerDay(3);
                    counselorScheduleRepository.save(cs2);

                    // 4. 管理员默认账号
                    User admin = new User();
                    admin.setUsername("admin");
                    admin.setPassword("123456");
                    admin.setRole("ADMIN");
                    admin.setName("系统安全管理员");
                    admin.setPhone("13700137000");
                    admin.setAvatar("https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150");
                    userRepository.save(admin);

                    // 5. 初始文章
                    Article art1 = new Article();
                    art1.setTitle("面对期末与DDL焦虑：你不是不够自律，而是太累了");
                    art1.setCategory("学业与成长");
                    art1.setCover("https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=500");
                    art1.setReadCount(3420);
                    art1.setLikesCount(285);
                    art1.setAuthor("陈清心 教授");
                    art1.setDate("2025-05-18");
                    art1.setSummary("很多人把拖延归结为意志力薄弱，但神经科学研究发现：拖延本质上是对负面情绪的逃避。教你3步切断内耗回路。");
                    art1.setContent("很多同学把拖延归咎于自制力，但心理学研究发现：拖延本质上是情绪调节问题。降级启动，允许第一稿不完美，能帮你迅速破局。");
                    articleRepository.save(art1);

                    // 6. 初始树洞
                    TreeholePost p1 = new TreeholePost();
                    p1.setUserId(savedStudent.getId());
                    p1.setAnonymousName("微风中的银杏");
                    p1.setAvatarTag("🍂");
                    p1.setAvatarColor("#FA8C16");
                    p1.setTag("学业困惑");
                    p1.setContent("大二专业课越学越难，今天做数字音频卡了整整五个小时...看着身边的同学一个个交了优秀作业，感觉自己好挫败。");
                    p1.setHugCount(38);
                    p1.setStatus("NORMAL");
                    treeholePostRepository.save(p1);

                    // 7. 初始预约
                    Appointment apt = new Appointment();
                    apt.setStudentUserId(savedStudent.getId());
                    apt.setStudentName("林微光");
                    apt.setStudentPhone("13800138000");
                    apt.setCounselorUserId(savedCounselor.getId());
                    apt.setCounselorName("陈清心");
                    apt.setCounselorTitle("副教授 / 国家二级心理咨询师");
                    apt.setConsultDate("2025-05-26");
                    apt.setTimeSlot("14:30 - 15:30");
                    apt.setMode("线下咨询");
                    apt.setLocation("阳光校区 心理健康中心 302室");
                    apt.setProblemCategory("学业与前途焦虑");
                    apt.setDescription("面对期末作业及考研压力，经常陷入内耗拖延，难以专注。");
                    apt.setStatus("CONFIRMED");
                    apt.setFeedbackNotes("已安排302个案咨询室，请提前5分钟到达。");
                    appointmentRepository.save(apt);

                    // 8. 危机预警
                    CrisisAlert alert = new CrisisAlert();
                    alert.setStudentUserId(savedStudent.getId());
                    alert.setStudentName("赵*涵");
                    alert.setCollege("计算机科学与技术学院");
                    alert.setGrade("大一");
                    alert.setPhone("13900001122");
                    alert.setLevel("red");
                    alert.setLevelName("重度红色预警");
                    alert.setTriggerReason("SDS抑郁自评量表标准分81分（重度抑郁）+ 测评第19题高危筛查阳性");
                    alert.setTriggerTime("2025-05-20 14:22");
                    alert.setScaleScore(81);
                    alert.setStatus("PENDING");
                    alert.setCounselorInCharge("陈清心");
                    alert.setNotes("已由学院辅导员电话联系，情绪低落，建议当天下午线下紧急面谈评估。");
                    crisisAlertRepository.save(alert);

                    System.out.println(">>> 默认种子数据初始化完成！");
                }
            } catch (Exception e) {
                System.out.println(">>> 提示: 数据表已由MySQL存在或无需重复初始化: " + e.getMessage());
            }
        };
    }
}
