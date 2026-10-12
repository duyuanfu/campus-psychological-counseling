package com.campus.psychology.repository;

import com.campus.psychology.entity.TreeholeComment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TreeholeCommentRepository extends JpaRepository<TreeholeComment, Long> {
    List<TreeholeComment> findByPostIdOrderByCreatedAtAsc(Long postId);
}
