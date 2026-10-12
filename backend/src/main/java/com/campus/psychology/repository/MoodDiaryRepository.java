package com.campus.psychology.repository;

import com.campus.psychology.entity.MoodDiary;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MoodDiaryRepository extends JpaRepository<MoodDiary, Long> {
    List<MoodDiary> findByStudentUserIdOrderByCreatedAtDesc(Long studentUserId);
}
