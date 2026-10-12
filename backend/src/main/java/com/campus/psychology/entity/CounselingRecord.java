package com.campus.psychology.entity;

import lombok.Data;
import javax.persistence.*;
import java.util.Date;

@Data
@Entity
@Table(name = "counseling_record")
public class CounselingRecord {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "appointment_id")
    private Long appointmentId;

    @Column(name = "student_user_id")
    private Long studentUserId;

    @Column(name = "student_name", nullable = false, length = 50)
    private String studentName;

    @Column(name = "student_major", length = 100)
    private String studentMajor;

    @Column(name = "counselor_name", nullable = false, length = 50)
    private String counselorName;

    @Column(name = "consult_date", nullable = false, length = 20)
    private String consultDate;

    @Column(length = 50)
    private String duration = "50分钟";

    @Column(length = 50)
    private String type = "个体心理咨询";

    @Column(name = "risk_level", length = 50)
    private String riskLevel = "常规 (低风险)";

    @Column(name = "mental_status", columnDefinition = "TEXT")
    private String mentalStatus;

    @Column(name = "complaint_summary", columnDefinition = "TEXT")
    private String complaintSummary;

    @Column(name = "assessment_result", columnDefinition = "TEXT")
    private String assessmentResult;

    @Column(name = "intervention_strategy", columnDefinition = "TEXT")
    private String interventionStrategy;

    @Column(name = "followup_plan", columnDefinition = "TEXT")
    private String followupPlan;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "created_at")
    private Date createdAt = new Date();
}
