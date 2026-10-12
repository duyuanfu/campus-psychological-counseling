package com.campus.psychology.repository;

import com.campus.psychology.entity.StudentProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface StudentProfileRepository extends JpaRepository<StudentProfile, Long> {
    Optional<StudentProfile> findByUserId(Long userId);
    Optional<StudentProfile> findByStudentId(String studentId);
}
