package com.campus.psychology.entity;

import lombok.Data;
import javax.persistence.*;

@Data
@Entity
@Table(name = "counselor_schedule")
public class CounselorSchedule {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "counselor_user_id", nullable = false)
    private Long counselorUserId;

    @Column(name = "available_days", length = 255)
    private String availableDays; // 周二,周三,周四,周五

    @Column(name = "time_slots", columnDefinition = "TEXT")
    private String timeSlots; // 09:00 - 10:00,10:30 - 11:30,14:30 - 15:30

    @Column(name = "max_per_day")
    private Integer maxPerDay = 4;
}
