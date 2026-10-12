package com.campus.psychology.repository;

import com.campus.psychology.entity.TreeholePost;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TreeholePostRepository extends JpaRepository<TreeholePost, Long> {
    List<TreeholePost> findByStatusOrderByCreatedAtDesc(String status);
    List<TreeholePost> findByStatusAndTagOrderByCreatedAtDesc(String status, String tag);
}
