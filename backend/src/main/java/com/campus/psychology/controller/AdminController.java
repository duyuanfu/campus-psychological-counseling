package com.campus.psychology.controller;

import com.campus.psychology.common.Result;
import com.campus.psychology.entity.*;
import com.campus.psychology.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private StudentProfileRepository studentProfileRepository;

    @Autowired
    private CounselorProfileRepository counselorProfileRepository;

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private CrisisAlertRepository crisisAlertRepository;

    @Autowired
    private CounselingRecordRepository counselingRecordRepository;

    @Autowired
    private ArticleRepository articleRepository;

    @Autowired
    private TreeholePostRepository treeholePostRepository;

    // 工作台关键指标
    @GetMapping("/metrics")
    public Result<Map<String, Object>> getMetrics() {
        Map<String, Object> map = new HashMap<>();
        map.put("studentCount", userRepository.findByRole("STUDENT").size());
        map.put("counselorCount", userRepository.findByRole("COUNSELOR").size());
        map.put("articleCount", articleRepository.count());
        map.put("treeholeCount", treeholePostRepository.count());
        map.put("crisisCount", crisisAlertRepository.findByStatusOrderByCreatedAtDesc("PENDING").size());
        map.put("appointmentCount", appointmentRepository.count());
        return Result.success(map);
    }

    // 危机预警专区
    @GetMapping("/crisis/alerts")
    public Result<List<CrisisAlert>> getCrisisAlerts(@RequestParam(value = "status", required = false) String status) {
        if (status != null && !status.isEmpty() && !"all".equalsIgnoreCase(status)) {
            return Result.success(crisisAlertRepository.findByStatusOrderByCreatedAtDesc(status.toUpperCase()));
        }
        return Result.success(crisisAlertRepository.findAllByOrderByCreatedAtDesc());
    }

    @PutMapping("/crisis/alerts/{id}/status")
    public Result<CrisisAlert> updateCrisisStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        Optional<CrisisAlert> alertOpt = crisisAlertRepository.findById(id);
        if (!alertOpt.isPresent()) return Result.error(404, "预警个案不存在");

        CrisisAlert alert = alertOpt.get();
        if (body.get("status") != null) alert.setStatus(body.get("status").toUpperCase());
        if (body.get("notes") != null) alert.setNotes(body.get("notes"));

        CrisisAlert saved = crisisAlertRepository.save(alert);
        return Result.success("处置状态已更新", saved);
    }

    // 咨询档案记录
    @GetMapping("/counseling/records")
    public Result<List<CounselingRecord>> getCounselingRecords() {
        return Result.success(counselingRecordRepository.findAllByOrderByCreatedAtDesc());
    }

    @PostMapping("/counseling/records")
    public Result<CounselingRecord> saveCounselingRecord(@RequestBody CounselingRecord record) {
        if (record.getConsultDate() == null) {
            record.setConsultDate(new java.text.SimpleDateFormat("yyyy-MM-dd").format(new Date()));
        }
        record.setCreatedAt(new Date());
        CounselingRecord saved = counselingRecordRepository.save(record);
        return Result.success("咨询个案档案已归档保存", saved);
    }

    // 数字媒体大屏看板数据
    @GetMapping("/bigscreen")
    public Result<Map<String, Object>> getBigScreenData() {
        Map<String, Object> data = new HashMap<>();

        // 全校情绪环形图分布
        List<Map<String, Object>> donutList = new ArrayList<>();
        donutList.add(createDonutItem("积极充沛", 890, "#10B981"));
        donutList.add(createDonutItem("平淡放空", 345, "#3B82F6"));
        donutList.add(createDonutItem("轻度焦虑", 148, "#F59E0B"));
        donutList.add(createDonutItem("重度预警", 37, "#EF4444"));
        data.put("emotionDonut", donutList);

        // 学院柱状图
        List<Map<String, Object>> barList = new ArrayList<>();
        barList.add(createBarItem("数媒院", 42, "#06B6D4"));
        barList.add(createBarItem("计科院", 58, "#3B82F6"));
        barList.add(createBarItem("经管院", 36, "#10B981"));
        barList.add(createBarItem("外语院", 24, "#A855F7"));
        barList.add(createBarItem("机电院", 31, "#F59E0B"));
        data.put("collegeBars", barList);

        // 月度咨询趋势
        data.put("monthlyTrend", Arrays.asList(120, 185, 340, 290, 485));
        data.put("monthLabels", Arrays.asList("1月", "2月", "3月", "4月", "5月"));

        return Result.success(data);
    }

    private Map<String, Object> createDonutItem(String name, int value, String color) {
        Map<String, Object> m = new HashMap<>();
        m.put("name", name);
        m.put("value", value);
        m.put("color", color);
        return m;
    }

    private Map<String, Object> createBarItem(String name, int value, String color) {
        Map<String, Object> m = new HashMap<>();
        m.put("name", name);
        m.put("value", value);
        m.put("color", color);
        return m;
    }
}
