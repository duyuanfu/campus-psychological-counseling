package com.campus.psychology.repository;

import com.campus.psychology.entity.CounselorProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface CounselorProfileRepository extends JpaRepository<CounselorProfile, Long> {
    Optional<CounselorProfile> findByUserId(Long userId);
}
