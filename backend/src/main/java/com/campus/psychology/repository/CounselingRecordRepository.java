package com.campus.psychology.repository;

import com.campus.psychology.entity.CounselingRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CounselingRecordRepository extends JpaRepository<CounselingRecord, Long> {
    List<CounselingRecord> findAllByOrderByCreatedAtDesc();
}
