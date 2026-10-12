package com.campus.psychology.entity;

import lombok.Data;
import javax.persistence.*;
import java.util.Date;

@Data
@Entity
@Table(name = "mood_diary")
public class MoodDiary {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "student_user_id", nullable = false)
    private Long studentUserId;

    @Column(nullable = false, length = 20)
    private String date;

    @Column(name = "mood_score", nullable = false)
    private Integer moodScore; // 1-5

    @Column(name = "mood_icon", nullable = false, length = 10)
    private String moodIcon;

    @Column(name = "mood_text", nullable = false, length = 50)
    private String moodText;

    @Column(length = 255)
    private String tags;

    @Column(columnDefinition = "TEXT")
    private String content;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "created_at")
    private Date createdAt = new Date();
}
