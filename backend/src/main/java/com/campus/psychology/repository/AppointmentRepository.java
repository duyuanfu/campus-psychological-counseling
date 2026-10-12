package com.campus.psychology.repository;

import com.campus.psychology.entity.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    List<Appointment> findByStudentUserIdOrderByCreatedAtDesc(Long studentUserId);
    List<Appointment> findByCounselorUserIdOrderByCreatedAtDesc(Long counselorUserId);
    List<Appointment> findByCounselorUserIdAndStatusOrderByCreatedAtDesc(Long counselorUserId, String status);
}
