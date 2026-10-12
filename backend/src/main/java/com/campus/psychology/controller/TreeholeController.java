package com.campus.psychology.controller;

import com.campus.psychology.common.JwtUtil;
import com.campus.psychology.common.Result;
import com.campus.psychology.dto.TreeholeCreateDTO;
import com.campus.psychology.entity.TreeholeComment;
import com.campus.psychology.entity.TreeholePost;
import com.campus.psychology.repository.TreeholeCommentRepository;
import com.campus.psychology.repository.TreeholePostRepository;
import io.jsonwebtoken.Claims;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/treehole")
public class TreeholeController {

    @Autowired
    private TreeholePostRepository treeholePostRepository;

    @Autowired
    private TreeholeCommentRepository treeholeCommentRepository;

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

    @GetMapping("/posts")
    public Result<List<Map<String, Object>>> getPosts(@RequestParam(value = "tag", required = false) String tag) {
        List<TreeholePost> posts;
        if (tag != null && !tag.trim().isEmpty() && !"全部话题".equals(tag)) {
            posts = treeholePostRepository.findByStatusAndTagOrderByCreatedAtDesc("NORMAL", tag.trim());
        } else {
            posts = treeholePostRepository.findByStatusOrderByCreatedAtDesc("NORMAL");
        }

        List<Map<String, Object>> result = new ArrayList<>();
        for (TreeholePost p : posts) {
            Map<String, Object> map = new HashMap<>();
            map.put("id", p.getId());
            map.put("anonymousName", p.getAnonymousName());
            map.put("avatarTag", p.getAvatarTag());
            map.put("avatarColor", p.getAvatarColor());
            map.put("tag", p.getTag());
            map.put("content", p.getContent());
            map.put("hugCount", p.getHugCount());
            map.put("timeDesc", "刚刚");

            List<TreeholeComment> comments = treeholeCommentRepository.findByPostIdOrderByCreatedAtAsc(p.getId());
            map.put("commentCount", comments.size());
            map.put("comments", comments);

            result.add(map);
        }

        return Result.success(result);
    }

    @PostMapping("/posts")
    public Result<TreeholePost> createPost(@RequestHeader(value = "Authorization", required = false) String token,
                                          @RequestBody TreeholeCreateDTO dto) {
        Long userId = getUserIdFromToken(token);
        if (userId == null) userId = 1L;

        TreeholePost post = new TreeholePost();
        post.setUserId(userId);
        post.setAnonymousName(dto.getAnonymousName() != null ? dto.getAnonymousName() : "温暖的向日葵");
        post.setAvatarTag(dto.getAvatarTag() != null ? dto.getAvatarTag() : "🌻");
        post.setAvatarColor(dto.getAvatarColor() != null ? dto.getAvatarColor() : "#FA8C16");
        post.setTag(dto.getTag() != null ? dto.getTag() : "心情碎碎念");
        post.setContent(dto.getContent());
        post.setHugCount(0);
        post.setStatus("NORMAL");
        post.setCreatedAt(new Date());

        TreeholePost saved = treeholePostRepository.save(post);
        return Result.success("已发布至树洞", saved);
    }

    @PostMapping("/posts/{id}/hug")
    public Result<Integer> toggleHug(@PathVariable Long id) {
        Optional<TreeholePost> pOpt = treeholePostRepository.findById(id);
        if (!pOpt.isPresent()) return Result.error(404, "贴子不存在");

        TreeholePost post = pOpt.get();
        post.setHugCount((post.getHugCount() == null ? 0 : post.getHugCount()) + 1);
        treeholePostRepository.save(post);

        return Result.success("抱抱成功", post.getHugCount());
    }

    @PostMapping("/posts/{id}/comments")
    public Result<TreeholeComment> addComment(@PathVariable Long id,
                                             @RequestHeader(value = "Authorization", required = false) String token,
                                             @RequestBody Map<String, String> body) {
        Long userId = getUserIdFromToken(token);
        if (userId == null) userId = 1L;

        TreeholeComment c = new TreeholeComment();
        c.setPostId(id);
        c.setUserId(userId);
        c.setAnonymousName(body.getOrDefault("anonymousName", "温暖同路人"));
        c.setContent(body.getOrDefault("content", "抱抱你！"));
        c.setCreatedAt(new Date());

        TreeholeComment saved = treeholeCommentRepository.save(c);
        return Result.success("评论成功", saved);
    }

    @DeleteMapping("/posts/{id}")
    public Result<Void> deletePost(@PathVariable Long id) {
        treeholePostRepository.deleteById(id);
        return Result.success("已违规下架", null);
    }
}
