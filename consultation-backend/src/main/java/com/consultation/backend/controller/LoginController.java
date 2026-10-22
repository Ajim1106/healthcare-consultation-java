package com.consultation.backend.controller;

import com.consultation.backend.dto.LoginRequest;
import com.consultation.backend.dto.LoginResponse;
import com.consultation.backend.model.Admin;
import com.consultation.backend.model.Doctor;
import com.consultation.backend.model.Patient;
import com.consultation.backend.repository.AdminRepository;
import com.consultation.backend.repository.DoctorRepository;
import com.consultation.backend.repository.PatientRepository;
import com.consultation.backend.security.JwtUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/login")
public class LoginController {

    private final AdminRepository   adminRepo;
    private final DoctorRepository  doctorRepo;
    private final PatientRepository patientRepo;
    private final JwtUtil           jwtUtil;
    private final PasswordEncoder   passwordEncoder;

    public LoginController(AdminRepository adminRepo, DoctorRepository doctorRepo,
                           PatientRepository patientRepo, JwtUtil jwtUtil,
                           PasswordEncoder passwordEncoder) {
        this.adminRepo       = adminRepo;
        this.doctorRepo      = doctorRepo;
        this.patientRepo     = patientRepo;
        this.jwtUtil         = jwtUtil;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping
    public ResponseEntity<?> login(@RequestBody LoginRequest req) {
        if (req.getRole() == null || req.getEmail() == null || req.getPassword() == null) {
            return ResponseEntity.badRequest().body("Email, password and role are required");
        }

        Object user = null;

        switch (req.getRole().toLowerCase()) {
            case "admin" -> {
                Optional<Admin> admin = adminRepo.findByEmail(req.getEmail());
                if (admin.isPresent() && passwordEncoder.matches(req.getPassword(), admin.get().getPassword())) {
                    user = admin.get();
                }
            }
            case "doctor" -> {
                Optional<Doctor> doctor = doctorRepo.findByEmail(req.getEmail());
                if (doctor.isPresent() && passwordEncoder.matches(req.getPassword(), doctor.get().getPassword())) {
                    user = doctor.get();
                }
            }
            case "patient" -> {
                Optional<Patient> patient = patientRepo.findByEmail(req.getEmail());
                if (patient.isPresent() && passwordEncoder.matches(req.getPassword(), patient.get().getPassword())) {
                    user = patient.get();
                }
            }
            default -> {
                return ResponseEntity.badRequest().body("Invalid role. Must be admin, doctor, or patient.");
            }
        }

        if (user == null) {
            return ResponseEntity.status(401).body("Invalid credentials");
        }

        String token = jwtUtil.generateToken(req.getEmail(), req.getRole().toLowerCase());
        return ResponseEntity.ok(new LoginResponse(token, user));
    }
}
