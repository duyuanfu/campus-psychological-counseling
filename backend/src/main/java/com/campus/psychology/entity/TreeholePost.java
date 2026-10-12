package com.campus.psychology.entity;

import lombok.Data;
import javax.persistence.*;
import java.util.Date;

@Data
@Entity
@Table(name = "treehole_post")
public class TreeholePost {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "anonymous_name", nullable = false, length = 50)
    private String anonymousName;

    @Column(name = "avatar_tag", length = 10)
    private String avatarTag = "🌻";

    @Column(name = "avatar_color", length = 20)
    private String avatarColor = "#FA8C16";

    @Column(nullable = false, length = 50)
    private String tag;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    @Column(name = "hug_count")
    private Integer hugCount = 0;

    @Column(length = 20)
    private String status = "NORMAL"; // NORMAL, APPROVED, VIOLATION

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "created_at")
    private Date createdAt = new Date();
}
