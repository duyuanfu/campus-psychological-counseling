package com.campus.psychology.entity;

import lombok.Data;
import javax.persistence.*;
import java.util.Date;

@Data
@Entity
@Table(name = "treehole_comment")
public class TreeholeComment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "post_id", nullable = false)
    private Long postId;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "anonymous_name", length = 50)
    private String anonymousName = "温暖同路人";

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "created_at")
    private Date createdAt = new Date();
}
