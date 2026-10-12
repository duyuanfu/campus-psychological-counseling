package com.campus.psychology.dto;

import lombok.Data;

@Data
public class RegisterDTO {
    private String role; // STUDENT 或 COUNSELOR
    private String username;
    private String password;
    private String name;
    private String phone;

    // 学生专属扩展字段
    private String studentId;
    private String college;
    private String major;
    private String grade;
    private String emergencyContact;
    private String emergencyPhone;

    // 咨询师专属扩展字段
    private String title;
    private String qualification;
    private String experience;
    private String tags;
    private String intro;
    private String location;
}
