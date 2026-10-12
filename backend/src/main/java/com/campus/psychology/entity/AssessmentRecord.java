package com.campus.psychology.entity;

import lombok.Data;
import javax.persistence.*;
import java.util.Date;

@Data
@Entity
@Table(name = "assessment_record")
public class AssessmentRecord {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "student_user_id", nullable = false)
    private Long studentUserId;

    @Column(name = "scale_id", nullable = false, length = 50)
    private String scaleId;

    @Column(name = "scale_title", nullable = false, length = 100)
    private String scaleTitle;

    @Column(name = "raw_score", nullable = false)
    private Integer rawScore;

    @Column(name = "standard_score", nullable = false)
    private Integer standardScore;

    @Column(nullable = false, length = 20)
    private String level; // normal, mild, moderate, severe

    @Column(name = "level_title", nullable = false, length = 50)
    private String levelTitle;

    @Column(name = "dimension_scores", columnDefinition = "TEXT")
    private String dimensionScores; // JSON字符串

    @Column(columnDefinition = "TEXT")
    private String analysis;

    @Column(columnDefinition = "TEXT")
    private String suggestions; // JSON字符串

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "created_at")
    private Date createdAt = new Date();
}
