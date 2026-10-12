package com.campus.psychology.entity;

import lombok.Data;
import javax.persistence.*;
import java.util.Date;

@Data
@Entity
@Table(name = "crisis_alert")
public class CrisisAlert {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "student_user_id")
    private Long studentUserId;

    @Column(name = "student_name", nullable = false, length = 50)
    private String studentName;

    @Column(length = 100)
    private String college;

    @Column(length = 50)
    private String grade;

    @Column(length = 20)
    private String phone;

    @Column(nullable = false, length = 20)
    private String level; // red, yellow

    @Column(name = "level_name", nullable = false, length = 50)
    private String levelName;

    @Column(name = "trigger_reason", nullable = false, columnDefinition = "TEXT")
    private String triggerReason;

    @Column(name = "trigger_time", nullable = false, length = 50)
    private String triggerTime;

    @Column(name = "scale_score")
    private Integer scaleScore;

    @Column(length = 20)
    private String status = "PENDING"; // PENDING, HANDLING, RESOLVED

    @Column(name = "counselor_in_charge", length = 50)
    private String counselorInCharge;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "created_at")
    private Date createdAt = new Date();
}
