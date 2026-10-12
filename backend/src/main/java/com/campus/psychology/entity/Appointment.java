package com.campus.psychology.entity;

import lombok.Data;
import javax.persistence.*;
import java.util.Date;

@Data
@Entity
@Table(name = "appointment")
public class Appointment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "student_user_id", nullable = false)
    private Long studentUserId;

    @Column(name = "student_name", nullable = false, length = 50)
    private String studentName;

    @Column(name = "student_phone", length = 20)
    private String studentPhone;

    @Column(name = "emergency_phone", length = 20)
    private String emergencyPhone;

    @Column(name = "counselor_user_id", nullable = false)
    private Long counselorUserId;

    @Column(name = "counselor_name", nullable = false, length = 50)
    private String counselorName;

    @Column(name = "counselor_title", length = 100)
    private String counselorTitle;

    @Column(name = "consult_date", nullable = false, length = 20)
    private String consultDate;

    @Column(name = "time_slot", nullable = false, length = 50)
    private String timeSlot;

    @Column(length = 50)
    private String mode = "线下咨询";

    @Column(length = 255)
    private String location;

    @Column(name = "problem_category", length = 100)
    private String problemCategory;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(length = 20)
    private String status = "PENDING"; // PENDING, CONFIRMED, COMPLETED, REJECTED, CANCELED

    @Column(name = "feedback_notes", columnDefinition = "TEXT")
    private String feedbackNotes;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "created_at")
    private Date createdAt = new Date();
}
