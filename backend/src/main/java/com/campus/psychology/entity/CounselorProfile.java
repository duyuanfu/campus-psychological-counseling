package com.campus.psychology.entity;

import lombok.Data;
import javax.persistence.*;
import java.math.BigDecimal;

@Data
@Entity
@Table(name = "counselor_profile")
public class CounselorProfile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(length = 100)
    private String title;

    @Column(length = 255)
    private String qualification;

    @Column(length = 100)
    private String college;

    @Column(length = 100)
    private String experience;

    @Column(precision = 3, scale = 2)
    private BigDecimal rating = new BigDecimal("4.95");

    @Column(name = "consult_count")
    private Integer consultCount = 0;

    @Column(length = 255)
    private String tags;

    @Column(columnDefinition = "TEXT")
    private String intro;

    @Column(length = 255)
    private String location;

    @Column(name = "available_modes", length = 100)
    private String availableModes = "线下咨询,线上视频";

    @Column(name = "work_hours", length = 100)
    private String workHours;
}
