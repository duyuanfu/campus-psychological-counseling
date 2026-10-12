package com.campus.psychology.repository;

import com.campus.psychology.entity.Article;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ArticleRepository extends JpaRepository<Article, Long> {
    List<Article> findAllByOrderByCreatedAtDesc();
}
