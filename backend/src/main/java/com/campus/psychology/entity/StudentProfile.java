package com.campus.psychology.entity;

import lombok.Data;
import javax.persistence.*;

@Data
@Entity
@Table(name = "student_profile")
public class StudentProfile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "student_id", nullable = false, length = 50)
    private String studentId;

    @Column(length = 100)
    private String college;

    @Column(length = 100)
    private String major;

    @Column(length = 50)
    private String grade;

    @Column(name = "emergency_contact", length = 50)
    private String emergencyContact;

    @Column(name = "emergency_phone", length = 50)
    private String emergencyPhone;

    @Column(name = "is_certified")
    private Boolean isCertified = true;
}
