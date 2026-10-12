package com.campus.psychology.controller;

import com.campus.psychology.common.JwtUtil;
import com.campus.psychology.common.Result;
import com.campus.psychology.entity.Article;
import com.campus.psychology.entity.MoodDiary;
import com.campus.psychology.repository.ArticleRepository;
import com.campus.psychology.repository.MoodDiaryRepository;
import io.jsonwebtoken.Claims;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/relax")
public class RelaxController {

    @Autowired
    private MoodDiaryRepository moodDiaryRepository;

    @Autowired
    private ArticleRepository articleRepository;

    @Autowired
    private JwtUtil jwtUtil;

    private Long getUserIdFromToken(String authHeader) {
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            authHeader = authHeader.substring(7);
        }
        if (authHeader == null || !jwtUtil.validateToken(authHeader)) return null;
        Claims claims = jwtUtil.getClaimsFromToken(authHeader);
        return Long.valueOf(claims.get("userId").toString());
    }

    // 情绪日记
    @GetMapping("/diaries")
    public Result<List<MoodDiary>> getDiaries(@RequestHeader(value = "Authorization", required = false) String token) {
        Long userId = getUserIdFromToken(token);
        if (userId == null) userId = 1L;

        List<MoodDiary> list = moodDiaryRepository.findByStudentUserIdOrderByCreatedAtDesc(userId);
        return Result.success(list);
    }

    @PostMapping("/diaries")
    public Result<MoodDiary> saveDiary(@RequestHeader(value = "Authorization", required = false) String token,
                                      @RequestBody MoodDiary diary) {
        Long userId = getUserIdFromToken(token);
        if (userId == null) userId = 1L;

        diary.setStudentUserId(userId);
        if (diary.getDate() == null) {
            diary.setDate(new java.text.SimpleDateFormat("yyyy-MM-dd").format(new Date()));
        }
        diary.setCreatedAt(new Date());

        MoodDiary saved = moodDiaryRepository.save(diary);
        return Result.success("日记保存成功", saved);
    }

    // 科普文章
    @GetMapping("/articles")
    public Result<List<Article>> getArticles() {
        return Result.success(articleRepository.findAllByOrderByCreatedAtDesc());
    }

    @GetMapping("/articles/{id}")
    public Result<Article> getArticleDetail(@PathVariable Long id) {
        Optional<Article> art = articleRepository.findById(id);
        return art.map(Result::success).orElseGet(() -> Result.error(404, "文章不存在"));
    }

    @PostMapping("/articles")
    public Result<Article> createArticle(@RequestBody Article article) {
        if (article.getDate() == null) {
            article.setDate(new java.text.SimpleDateFormat("yyyy-MM-dd").format(new Date()));
        }
        article.setCreatedAt(new Date());
        Article saved = articleRepository.save(article);
        return Result.success("文章发布成功", saved);
    }

    @DeleteMapping("/articles/{id}")
    public Result<Void> deleteArticle(@PathVariable Long id) {
        articleRepository.deleteById(id);
        return Result.success("文章已删除", null);
    }
}
