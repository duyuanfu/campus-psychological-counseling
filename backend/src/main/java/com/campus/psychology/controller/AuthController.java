package com.campus.psychology.controller;

import com.campus.psychology.common.JwtUtil;
import com.campus.psychology.common.Result;
import com.campus.psychology.dto.LoginDTO;
import com.campus.psychology.dto.RegisterDTO;
import com.campus.psychology.entity.User;
import com.campus.psychology.repository.UserRepository;
import com.campus.psychology.service.AuthService;
import io.jsonwebtoken.Claims;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/login")
    public Result<Map<String, Object>> login(@RequestBody LoginDTO loginDTO) {
        return authService.login(loginDTO);
    }

    @PostMapping("/register")
    public Result<Map<String, Object>> register(@RequestBody RegisterDTO registerDTO) {
        return authService.register(registerDTO);
    }

    @GetMapping("/profile")
    public Result<Map<String, Object>> getProfile(@RequestHeader(value = "Authorization", required = false) String token) {
        if (token != null && token.startsWith("Bearer ")) {
            token = token.substring(7);
        }
        if (token == null || !jwtUtil.validateToken(token)) {
            return Result.error(401, "请先登录");
        }

        Claims claims = jwtUtil.getClaimsFromToken(token);
        Long userId = Long.valueOf(claims.get("userId").toString());
        Optional<User> userOpt = userRepository.findById(userId);
        if (!userOpt.isPresent()) {
            return Result.error(404, "用户不存在");
        }

        return Result.success(authService.buildUserInfoMap(userOpt.get()));
    }
}
