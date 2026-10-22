package com.consultation.backend.dto;

import lombok.Data;

@Data
public class LoginRequest {
    private String email;
    private String password;
    private String role; // "admin", "doctor", "patient"
}
