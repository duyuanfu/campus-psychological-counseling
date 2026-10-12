package com.campus.psychology.entity;

import lombok.Data;
import javax.persistence.*;
import java.util.Date;

@Data
@Entity
@Table(name = "article")
public class Article {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(nullable = false, length = 50)
    private String category;

    @Column(length = 255)
    private String cover;

    @Column(name = "read_count")
    private Integer readCount = 0;

    @Column(name = "likes_count")
    private Integer likesCount = 0;

    @Column(nullable = false, length = 50)
    private String author;

    @Column(nullable = false, length = 20)
    private String date;

    @Column(columnDefinition = "TEXT")
    private String summary;

    @Column(columnDefinition = "TEXT")
    private String content; // 换行或JSON分隔段落

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "created_at")
    private Date createdAt = new Date();
}
