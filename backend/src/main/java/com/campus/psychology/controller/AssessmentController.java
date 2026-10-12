package com.campus.psychology.controller;

import com.campus.psychology.common.JwtUtil;
import com.campus.psychology.common.Result;
import com.campus.psychology.dto.AssessmentSubmitDTO;
import com.campus.psychology.entity.AssessmentRecord;
import com.campus.psychology.entity.CrisisAlert;
import com.campus.psychology.entity.User;
import com.campus.psychology.repository.AssessmentRecordRepository;
import com.campus.psychology.repository.CrisisAlertRepository;
import com.campus.psychology.repository.UserRepository;
import io.jsonwebtoken.Claims;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/assessment")
public class AssessmentController {

    @Autowired
    private AssessmentRecordRepository assessmentRecordRepository;

    @Autowired
    private CrisisAlertRepository crisisAlertRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    private Long getUserIdFromToken(String authHeader) {
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            authHeader = authHeader.substring(7);
        }
        if (authHeader == null || !jwtUtil.validateToken(authHeader)) return null;
        Claims claims = jwtUtil.getClaimsFromToken(authHeader);
        return Long.valueOf(claims.get("userId").toString());
    }

    @PostMapping("/submit")
    public Result<AssessmentRecord> submitAssessment(@RequestHeader(value = "Authorization", required = false) String token,
                                                    @RequestBody AssessmentSubmitDTO dto) {
        Long userId = getUserIdFromToken(token);
        if (userId == null) userId = 1L;

        User student = userRepository.findById(userId).orElse(new User());

        String scaleId = dto.getScaleId() != null ? dto.getScaleId().toLowerCase() : "sds";
        Map<Integer, Integer> answers = dto.getAnswers();
        if (answers == null || answers.isEmpty()) {
            return Result.error(400, "答题数据不能为空");
        }

        // 计算粗分
        int rawScore = 0;
        for (Integer score : answers.values()) {
            rawScore += (score != null ? score : 1);
        }

        // 标准分 = 粗分 * 1.25 取整
        int standardScore = (int) Math.round(rawScore * 1.25);

        String level = "normal";
        String levelTitle = "正常心境 (身心平衡)";
        String analysis = "";
        String suggestions = "[\"保持现有规律生活与健康运动\",\"通过情绪日记记录自我微小状态\",\"适度交流与倾听\"]";

        if ("sds".equals(scaleId)) {
            if (standardScore < 53) {
                level = "normal";
                levelTitle = "正常状态 (无抑郁倾向)";
                analysis = "您的SDS标准分为" + standardScore + "分（低于53分常模临界值），情绪总体处于平稳健康的积极区间。";
            } else if (standardScore <= 62) {
                level = "mild";
                levelTitle = "轻度情绪低落";
                analysis = "您的SDS标准分为" + standardScore + "分，近期存在轻微无精打采或学业倦怠。";
            } else if (standardScore <= 72) {
                level = "moderate";
                levelTitle = "中度抑郁状态";
                analysis = "您的SDS标准分为" + standardScore + "分，建议预约学校专职心理咨询师进行面对面疏导。";
            } else {
                level = "severe";
                levelTitle = "重度抑郁预警";
                analysis = "您的SDS标准分为" + standardScore + "分（达到或超过73分），系统已触发红色预警关怀。";

                // 自动插入重度危机预警
                CrisisAlert alert = new CrisisAlert();
                alert.setStudentUserId(userId);
                alert.setStudentName(student.getName() != null ? student.getName() : "学生来访者");
                alert.setCollege("数字媒体与设计学院");
                alert.setGrade("大二");
                alert.setPhone(student.getPhone() != null ? student.getPhone() : "13800138000");
                alert.setLevel("red");
                alert.setLevelName("重度红色预警 (SDS重度超标)");
                alert.setTriggerReason("SDS抑郁量表标准分达 " + standardScore + " 分 (>=73分)");
                alert.setTriggerTime(new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm").format(new Date()));
                alert.setScaleScore(standardScore);
                alert.setStatus("PENDING");
                alert.setCounselorInCharge("陈清心");
                alert.setNotes("系统自动触发，建议当面评估。");
                crisisAlertRepository.save(alert);
            }
        } else {
            // SAS 量表
            if (standardScore < 50) {
                level = "normal";
                levelTitle = "身心平静 (无焦虑症状)";
                analysis = "您的SAS标准分为" + standardScore + "分，自主神经系统处于放松平衡状态。";
            } else if (standardScore <= 59) {
                level = "mild";
                levelTitle = "轻度焦虑紧张";
                analysis = "您的SAS标准分为" + standardScore + "分，近期对考试或人际存在微小压力。";
            } else if (standardScore <= 69) {
                level = "moderate";
                levelTitle = "中度焦虑状态";
                analysis = "您的SAS标准分为" + standardScore + "分，伴随睡眠不佳或躯体紧绷。";
            } else {
                level = "severe";
                levelTitle = "重度焦虑预警";
                analysis = "您的SAS标准分为" + standardScore + "分，焦虑处于临床重度区间。";

                CrisisAlert alert = new CrisisAlert();
                alert.setStudentUserId(userId);
                alert.setStudentName(student.getName() != null ? student.getName() : "学生来访者");
                alert.setCollege("数字媒体与设计学院");
                alert.setGrade("大二");
                alert.setPhone(student.getPhone() != null ? student.getPhone() : "13800138000");
                alert.setLevel("red");
                alert.setLevelName("重度红色预警 (SAS焦虑重度)");
                alert.setTriggerReason("SAS焦虑量表标准分达 " + standardScore + " 分 (>=70分)");
                alert.setTriggerTime(new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm").format(new Date()));
                alert.setScaleScore(standardScore);
                alert.setStatus("PENDING");
                alert.setCounselorInCharge("陈清心");
                crisisAlertRepository.save(alert);
            }
        }

        // 雷达图维度JSON
        String dimScores = "[{\"name\":\"情绪低落\",\"score\":45},{\"name\":\"躯体障碍\",\"score\":38},{\"name\":\"精神运动\",\"score\":30},{\"name\":\"认知功能\",\"score\":40},{\"name\":\"自我价值\",\"score\":25},{\"name\":\"绝望风险\",\"score\":10}]";

        AssessmentRecord record = new AssessmentRecord();
        record.setStudentUserId(userId);
        record.setScaleId(scaleId);
        record.setScaleTitle("sds".equals(scaleId) ? "SDS 抑郁自评量表" : "SAS 焦虑自评量表");
        record.setRawScore(rawScore);
        record.setStandardScore(standardScore);
        record.setLevel(level);
        record.setLevelTitle(levelTitle);
        record.setDimensionScores(dimScores);
        record.setAnalysis(analysis);
        record.setSuggestions(suggestions);
        record.setCreatedAt(new Date());

        AssessmentRecord saved = assessmentRecordRepository.save(record);
        return Result.success("测评完成", saved);
    }

    @GetMapping("/history")
    public Result<List<AssessmentRecord>> getHistory(@RequestHeader(value = "Authorization", required = false) String token) {
        Long userId = getUserIdFromToken(token);
        if (userId == null) userId = 1L;

        List<AssessmentRecord> list = assessmentRecordRepository.findByStudentUserIdOrderByCreatedAtDesc(userId);
        return Result.success(list);
    }

    @GetMapping("/{id}")
    public Result<AssessmentRecord> getById(@PathVariable Long id) {
        Optional<AssessmentRecord> opt = assessmentRecordRepository.findById(id);
        return opt.map(Result::success).orElseGet(() -> Result.error(404, "测评报告不存在"));
    }
}
