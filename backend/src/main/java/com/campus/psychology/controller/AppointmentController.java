package com.campus.psychology.controller;

import com.campus.psychology.common.JwtUtil;
import com.campus.psychology.common.Result;
import com.campus.psychology.dto.AppointmentCreateDTO;
import com.campus.psychology.entity.Appointment;
import com.campus.psychology.entity.User;
import com.campus.psychology.repository.AppointmentRepository;
import com.campus.psychology.repository.UserRepository;
import io.jsonwebtoken.Claims;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/appointments")
public class AppointmentController {

    @Autowired
    private AppointmentRepository appointmentRepository;

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

    @PostMapping
    public Result<Appointment> createAppointment(@RequestHeader(value = "Authorization", required = false) String token,
                                                 @RequestBody AppointmentCreateDTO dto) {
        Long userId = getUserIdFromToken(token);
        if (userId == null) {
            userId = 1L; // 模拟默认学生ID
        }

        User student = userRepository.findById(userId).orElse(new User());
        User counselor = userRepository.findById(dto.getCounselorUserId()).orElse(new User());

        Appointment apt = new Appointment();
        apt.setStudentUserId(userId);
        apt.setStudentName(student.getName() != null ? student.getName() : "学生来访者");
        apt.setStudentPhone(dto.getStudentPhone() != null ? dto.getStudentPhone() : student.getPhone());
        apt.setEmergencyPhone(dto.getEmergencyPhone());
        apt.setCounselorUserId(dto.getCounselorUserId());
        apt.setCounselorName(counselor.getName() != null ? counselor.getName() : "心理咨询师");
        apt.setConsultDate(dto.getConsultDate());
        apt.setTimeSlot(dto.getTimeSlot());
        apt.setMode(dto.getMode() != null ? dto.getMode() : "线下咨询");
        apt.setLocation("阳光校区 心理健康中心 302室");
        apt.setProblemCategory(dto.getProblemCategory());
        apt.setDescription(dto.getDescription());
        apt.setStatus("PENDING");
        apt.setFeedbackNotes("等待咨询师审核确认");
        apt.setCreatedAt(new Date());

        Appointment saved = appointmentRepository.save(apt);
        return Result.success("预约申请已提交", saved);
    }

    @GetMapping("/my")
    public Result<List<Appointment>> getMyAppointments(@RequestHeader(value = "Authorization", required = false) String token) {
        Long userId = getUserIdFromToken(token);
        if (userId == null) userId = 1L;

        List<Appointment> list = appointmentRepository.findByStudentUserIdOrderByCreatedAtDesc(userId);
        return Result.success(list);
    }

    @GetMapping("/counselor")
    public Result<List<Appointment>> getCounselorAppointments(@RequestHeader(value = "Authorization", required = false) String token) {
        Long counselorId = getUserIdFromToken(token);
        if (counselorId == null) counselorId = 2L;

        List<Appointment> list = appointmentRepository.findByCounselorUserIdOrderByCreatedAtDesc(counselorId);
        return Result.success(list);
    }

    @PutMapping("/{id}/status")
    public Result<Appointment> updateStatus(@PathVariable Long id,
                                           @RequestBody Map<String, String> body) {
        Optional<Appointment> aptOpt = appointmentRepository.findById(id);
        if (!aptOpt.isPresent()) return Result.error(404, "预约单不存在");

        Appointment apt = aptOpt.get();
        String status = body.get("status");
        String notes = body.get("feedbackNotes");

        if (status != null) apt.setStatus(status.toUpperCase());
        if (notes != null) apt.setFeedbackNotes(notes);

        Appointment saved = appointmentRepository.save(apt);
        return Result.success("状态已更新", saved);
    }

    @PutMapping("/{id}/reschedule")
    public Result<Appointment> reschedule(@PathVariable Long id,
                                         @RequestBody Map<String, String> body) {
        Optional<Appointment> aptOpt = appointmentRepository.findById(id);
        if (!aptOpt.isPresent()) return Result.error(404, "预约单不存在");

        Appointment apt = aptOpt.get();
        apt.setConsultDate(body.get("date"));
        apt.setTimeSlot(body.get("slot"));
        apt.setStatus("PENDING");
        apt.setFeedbackNotes("学生重新选择了预约时段，等待咨询师确认。");

        Appointment saved = appointmentRepository.save(apt);
        return Result.success("改约申请已提交", saved);
    }

    @PutMapping("/{id}/cancel")
    public Result<Appointment> cancel(@PathVariable Long id) {
        Optional<Appointment> aptOpt = appointmentRepository.findById(id);
        if (!aptOpt.isPresent()) return Result.error(404, "预约单不存在");

        Appointment apt = aptOpt.get();
        apt.setStatus("CANCELED");
        apt.setFeedbackNotes("来访学生主动取消预约。");

        Appointment saved = appointmentRepository.save(apt);
        return Result.success("已取消预约", saved);
    }
}
