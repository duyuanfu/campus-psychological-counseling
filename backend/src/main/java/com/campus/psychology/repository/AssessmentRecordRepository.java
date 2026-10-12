package com.campus.psychology.repository;

import com.campus.psychology.entity.AssessmentRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AssessmentRecordRepository extends JpaRepository<AssessmentRecord, Long> {
    List<AssessmentRecord> findByStudentUserIdOrderByCreatedAtDesc(Long studentUserId);
}
