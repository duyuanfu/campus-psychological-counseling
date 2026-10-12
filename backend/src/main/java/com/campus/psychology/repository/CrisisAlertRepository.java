package com.campus.psychology.repository;

import com.campus.psychology.entity.CrisisAlert;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CrisisAlertRepository extends JpaRepository<CrisisAlert, Long> {
    List<CrisisAlert> findByStatusOrderByCreatedAtDesc(String status);
    List<CrisisAlert> findAllByOrderByCreatedAtDesc();
}
