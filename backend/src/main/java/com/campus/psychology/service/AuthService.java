package com.campus.psychology.service;

import com.campus.psychology.common.JwtUtil;
import com.campus.psychology.common.Result;
import com.campus.psychology.dto.LoginDTO;
import com.campus.psychology.dto.RegisterDTO;
import com.campus.psychology.entity.CounselorProfile;
import com.campus.psychology.entity.CounselorSchedule;
import com.campus.psychology.entity.StudentProfile;
import com.campus.psychology.entity.User;
import com.campus.psychology.repository.CounselorProfileRepository;
import com.campus.psychology.repository.CounselorScheduleRepository;
import com.campus.psychology.repository.StudentProfileRepository;
import com.campus.psychology.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private StudentProfileRepository studentProfileRepository;

    @Autowired
    private CounselorProfileRepository counselorProfileRepository;

    @Autowired
    private CounselorScheduleRepository counselorScheduleRepository;

    @Autowired
    private JwtUtil jwtUtil;

    /**
     * 用户登录 (支持学生端、咨询师端、管理员端)
     */
    public Result<Map<String, Object>> login(LoginDTO loginDTO) {
        if (loginDTO == null || loginDTO.getUsername() == null || loginDTO.getUsername().trim().isEmpty()) {
            return Result.error(400, "请输入登录账号");
        }
        if (loginDTO.getPassword() == null || loginDTO.getPassword().trim().isEmpty()) {
            return Result.error(400, "请输入登录密码");
        }

        Optional<User> userOpt = userRepository.findByUsername(loginDTO.getUsername().trim());
        if (!userOpt.isPresent()) {
            return Result.error(400, "账号不存在，请先注册");
        }

        User user = userOpt.get();
        if (!user.getPassword().equals(loginDTO.getPassword().trim())) {
            return Result.error(400, "账号或密码错误");
        }

        // 校验身份角色匹配 (忽略大小写)
        if (loginDTO.getRole() != null && !loginDTO.getRole().trim().isEmpty()) {
            String expectedRole = loginDTO.getRole().trim();
            if (!user.getRole().equalsIgnoreCase(expectedRole)) {
                return Result.error(403, "当前身份选择(" + expectedRole + ")与账号注册角色(" + user.getRole() + ")不符，请核对！");
            }
        }

        String token = jwtUtil.generateToken(user.getId(), user.getUsername(), user.getRole());

        Map<String, Object> data = new HashMap<>();
        data.put("token", token);
        data.put("user", buildUserInfoMap(user));

        return Result.success("登录成功", data);
    }

    /**
     * 用户注册 (支持学生身份 与 咨询师身份)
     */
    @Transactional
    public Result<Map<String, Object>> register(RegisterDTO registerDTO) {
        if (registerDTO == null || registerDTO.getUsername() == null || registerDTO.getUsername().trim().isEmpty()) {
            return Result.error(400, "登录账号不能为空");
        }
        if (registerDTO.getPassword() == null || registerDTO.getPassword().length() < 6) {
            return Result.error(400, "密码长度不能少于6位");
        }
        if (userRepository.existsByUsername(registerDTO.getUsername().trim())) {
            return Result.error(400, "该用户名已被注册，请更换！");
        }

        String role = (registerDTO.getRole() != null && registerDTO.getRole().equalsIgnoreCase("COUNSELOR"))
                ? "COUNSELOR" : "STUDENT";

        // 1. 创建 User 记录
        User user = new User();
        user.setUsername(registerDTO.getUsername().trim());
        user.setPassword(registerDTO.getPassword().trim());
        user.setRole(role);
        user.setName(registerDTO.getName() != null && !registerDTO.getName().trim().isEmpty() ? registerDTO.getName().trim() : registerDTO.getUsername().trim());
        user.setPhone(registerDTO.getPhone() != null ? registerDTO.getPhone().trim() : "13800000000");
        user.setStatus("ACTIVE");

        if ("STUDENT".equals(role)) {
            user.setAvatar("https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150");
        } else {
            user.setAvatar("https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150");
        }

        User savedUser = userRepository.save(user);

        // 2. 建立扩展档案
        if ("STUDENT".equals(role)) {
            StudentProfile profile = new StudentProfile();
            profile.setUserId(savedUser.getId());
            profile.setStudentId(registerDTO.getStudentId() != null && !registerDTO.getStudentId().trim().isEmpty()
                    ? registerDTO.getStudentId().trim() : "STU_" + System.currentTimeMillis() % 100000);
            profile.setCollege(registerDTO.getCollege() != null ? registerDTO.getCollege() : "数字媒体与设计学院");
            profile.setMajor(registerDTO.getMajor() != null ? registerDTO.getMajor() : "数字媒体艺术");
            profile.setGrade(registerDTO.getGrade() != null ? registerDTO.getGrade() : "大二");
            profile.setEmergencyContact(registerDTO.getEmergencyContact() != null ? registerDTO.getEmergencyContact() : "辅导员");
            profile.setEmergencyPhone(registerDTO.getEmergencyPhone() != null ? registerDTO.getEmergencyPhone() : "13900000000");
            profile.setIsCertified(true);
            studentProfileRepository.save(profile);
        } else {
            CounselorProfile cProfile = new CounselorProfile();
            cProfile.setUserId(savedUser.getId());
            cProfile.setTitle(registerDTO.getTitle() != null ? registerDTO.getTitle() : "专职心理咨询师");
            cProfile.setQualification(registerDTO.getQualification() != null ? registerDTO.getQualification() : "国家二级心理咨询师");
            cProfile.setCollege("学生心理健康教育与咨询中心");
            cProfile.setExperience(registerDTO.getExperience() != null ? registerDTO.getExperience() : "5年咨询实践");
            cProfile.setRating(new BigDecimal("4.95"));
            cProfile.setConsultCount(10);
            cProfile.setTags(registerDTO.getTags() != null ? registerDTO.getTags() : "情绪调节,学业压力,人际关系");
            cProfile.setIntro(registerDTO.getIntro() != null ? registerDTO.getIntro() : "倾听与接纳青年心灵，共同发掘内在韧性。");
            cProfile.setLocation(registerDTO.getLocation() != null ? registerDTO.getLocation() : "阳光校区 心理健康中心 302室");
            cProfile.setAvailableModes("线下咨询,线上视频");
            cProfile.setWorkHours("周二至周五 09:00 - 17:30");
            counselorProfileRepository.save(cProfile);

            // 预设默认排班
            CounselorSchedule schedule = new CounselorSchedule();
            schedule.setCounselorUserId(savedUser.getId());
            schedule.setAvailableDays("周二,周三,周四,周五");
            schedule.setTimeSlots("09:00 - 10:00,10:30 - 11:30,14:30 - 15:30,16:00 - 17:00");
            schedule.setMaxPerDay(4);
            counselorScheduleRepository.save(schedule);
        }

        String token = jwtUtil.generateToken(savedUser.getId(), savedUser.getUsername(), savedUser.getRole());

        Map<String, Object> data = new HashMap<>();
        data.put("token", token);
        data.put("user", buildUserInfoMap(savedUser));

        return Result.success("注册成功！", data);
    }

    public Map<String, Object> buildUserInfoMap(User user) {
        Map<String, Object> map = new HashMap<>();
        map.put("id", user.getId());
        map.put("username", user.getUsername());
        map.put("role", user.getRole().toLowerCase());
        map.put("name", user.getName());
        map.put("phone", user.getPhone() != null ? user.getPhone() : "");
        map.put("avatar", user.getAvatar() != null ? user.getAvatar() : "");

        if ("STUDENT".equalsIgnoreCase(user.getRole())) {
            Optional<StudentProfile> spOpt = studentProfileRepository.findByUserId(user.getId());
            if (spOpt.isPresent()) {
                StudentProfile sp = spOpt.get();
                map.put("studentId", sp.getStudentId());
                map.put("college", sp.getCollege());
                map.put("major", sp.getMajor());
                map.put("grade", sp.getGrade());
                map.put("emergencyContact", sp.getEmergencyContact());
                map.put("emergencyPhone", sp.getEmergencyPhone());
                map.put("isCertified", sp.getIsCertified() != null ? sp.getIsCertified() : true);
            } else {
                map.put("studentId", "2022030142");
                map.put("college", "数字媒体与设计学院");
                map.put("major", "数字媒体艺术");
                map.put("grade", "大二");
                map.put("isCertified", true);
            }
        } else if ("COUNSELOR".equalsIgnoreCase(user.getRole())) {
            Optional<CounselorProfile> cpOpt = counselorProfileRepository.findByUserId(user.getId());
            if (cpOpt.isPresent()) {
                CounselorProfile cp = cpOpt.get();
                map.put("title", cp.getTitle());
                map.put("qualification", cp.getQualification());
                map.put("college", cp.getCollege());
                map.put("experience", cp.getExperience());
                map.put("rating", cp.getRating());
                map.put("tags", cp.getTags());
                map.put("intro", cp.getIntro());
                map.put("location", cp.getLocation());
                map.put("isCertified", true);
            } else {
                map.put("title", "专职心理咨询师");
                map.put("qualification", "国家二级心理咨询师");
                map.put("college", "学生心理健康教育与咨询中心");
                map.put("isCertified", true);
            }
        }
        return map;
    }
}
