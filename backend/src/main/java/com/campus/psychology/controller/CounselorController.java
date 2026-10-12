package com.campus.psychology.controller;

import com.campus.psychology.common.Result;
import com.campus.psychology.entity.CounselorProfile;
import com.campus.psychology.entity.CounselorSchedule;
import com.campus.psychology.entity.User;
import com.campus.psychology.repository.CounselorProfileRepository;
import com.campus.psychology.repository.CounselorScheduleRepository;
import com.campus.psychology.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/counselors")
public class CounselorController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CounselorProfileRepository counselorProfileRepository;

    @Autowired
    private CounselorScheduleRepository counselorScheduleRepository;

    @GetMapping
    public Result<List<Map<String, Object>>> getCounselors() {
        List<User> users = userRepository.findByRole("COUNSELOR");
        List<Map<String, Object>> result = new ArrayList<>();

        for (User u : users) {
            Map<String, Object> map = new HashMap<>();
            map.put("id", u.getId());
            map.put("name", u.getName());
            map.put("avatar", u.getAvatar());
            map.put("phone", u.getPhone());

            Optional<CounselorProfile> cpOpt = counselorProfileRepository.findByUserId(u.getId());
            if (cpOpt.isPresent()) {
                CounselorProfile cp = cpOpt.get();
                map.put("title", cp.getTitle());
                map.put("qualification", cp.getQualification());
                map.put("college", cp.getCollege());
                map.put("experience", cp.getExperience());
                map.put("rating", cp.getRating());
                map.put("consultCount", cp.getConsultCount());
                map.put("intro", cp.getIntro());
                map.put("location", cp.getLocation());
                map.put("workHours", cp.getWorkHours());
                map.put("tagList", cp.getTags() != null ? Arrays.asList(cp.getTags().split(",")) : Collections.emptyList());
                map.put("availableModes", cp.getAvailableModes() != null ? Arrays.asList(cp.getAvailableModes().split(",")) : Collections.emptyList());
            } else {
                map.put("title", "国家注册心理咨询师");
                map.put("rating", 4.95);
                map.put("tagList", Arrays.asList("情绪调节", "学业压力"));
            }
            result.add(map);
        }

        return Result.success(result);
    }

    @GetMapping("/{id}")
    public Result<Map<String, Object>> getCounselorDetail(@PathVariable Long id) {
        Optional<User> uOpt = userRepository.findById(id);
        if (!uOpt.isPresent()) {
            return Result.error(404, "咨询师不存在");
        }
        User u = uOpt.get();
        Map<String, Object> map = new HashMap<>();
        map.put("id", u.getId());
        map.put("name", u.getName());
        map.put("avatar", u.getAvatar());

        counselorProfileRepository.findByUserId(u.getId()).ifPresent(cp -> {
            map.put("title", cp.getTitle());
            map.put("qualification", cp.getQualification());
            map.put("college", cp.getCollege());
            map.put("rating", cp.getRating());
            map.put("intro", cp.getIntro());
            map.put("location", cp.getLocation());
            map.put("workHours", cp.getWorkHours());
            map.put("tagList", cp.getTags() != null ? Arrays.asList(cp.getTags().split(",")) : Collections.emptyList());
            map.put("availableModes", cp.getAvailableModes() != null ? Arrays.asList(cp.getAvailableModes().split(",")) : Collections.emptyList());
        });

        counselorScheduleRepository.findByCounselorUserId(u.getId()).ifPresent(cs -> {
            Map<String, Object> scheduleMap = new HashMap<>();
            scheduleMap.put("days", cs.getAvailableDays() != null ? Arrays.asList(cs.getAvailableDays().split(",")) : Collections.emptyList());
            scheduleMap.put("slots", cs.getTimeSlots() != null ? Arrays.asList(cs.getTimeSlots().split(",")) : Collections.emptyList());
            scheduleMap.put("maxPerDay", cs.getMaxPerDay());
            map.put("schedule", scheduleMap);
        });

        return Result.success(map);
    }

    @GetMapping("/schedule/{counselorId}")
    public Result<CounselorSchedule> getSchedule(@PathVariable Long counselorId) {
        Optional<CounselorSchedule> cs = counselorScheduleRepository.findByCounselorUserId(counselorId);
        return Result.success(cs.orElse(new CounselorSchedule()));
    }

    @PostMapping("/schedule")
    public Result<CounselorSchedule> updateSchedule(@RequestBody CounselorSchedule schedule) {
        Optional<CounselorSchedule> existOpt = counselorScheduleRepository.findByCounselorUserId(schedule.getCounselorUserId());
        CounselorSchedule target = existOpt.orElse(schedule);
        target.setAvailableDays(schedule.getAvailableDays());
        target.setTimeSlots(schedule.getTimeSlots());
        target.setMaxPerDay(schedule.getMaxPerDay());

        CounselorSchedule saved = counselorScheduleRepository.save(target);
        return Result.success("排班更新成功", saved);
    }
}
