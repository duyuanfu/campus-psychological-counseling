package com.campus.psychology.dto;

import lombok.Data;

@Data
public class AppointmentCreateDTO {
    private Long counselorUserId;
    private String consultDate;
    private String timeSlot;
    private String mode;
    private String problemCategory;
    private String description;
    private String studentPhone;
    private String emergencyPhone;
}
