package com.campus.psychology.repository;

import com.campus.psychology.entity.CounselorSchedule;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface CounselorScheduleRepository extends JpaRepository<CounselorSchedule, Long> {
    Optional<CounselorSchedule> findByCounselorUserId(Long counselorUserId);
}
