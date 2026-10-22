package com.consultation.backend.controller;

import com.consultation.backend.model.Admin;
import com.consultation.backend.model.Doctor;
import com.consultation.backend.model.DoctorAvailability;
import com.consultation.backend.model.Patient;
import com.consultation.backend.model.ProfileStatus;
import com.consultation.backend.repository.AdminRepository;
import com.consultation.backend.repository.DoctorRepository;
import com.consultation.backend.repository.PatientRepository;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/register")
public class RegisterController {

    private final PatientRepository patientRepo;
    private final DoctorRepository  doctorRepo;
    private final AdminRepository   adminRepo;
    private final PasswordEncoder   passwordEncoder;

    public RegisterController(PatientRepository patientRepo, DoctorRepository doctorRepo,
                              AdminRepository adminRepo, PasswordEncoder passwordEncoder) {
        this.patientRepo     = patientRepo;
        this.doctorRepo      = doctorRepo;
        this.adminRepo       = adminRepo;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/patient")
    public ResponseEntity<?> registerPatient(@RequestBody Patient patient) {
        patient.setPassword(passwordEncoder.encode(patient.getPassword()));
        patientRepo.save(patient);
        return ResponseEntity.ok("Patient registered successfully");
    }

    @PostMapping("/doctor")
    public ResponseEntity<?> registerDoctor(@RequestBody Doctor doctor) {
        // Set default status to Pending so Admin approves it
        doctor.setProfileStatus(ProfileStatus.Pending);
        doctor.setPassword(passwordEncoder.encode(doctor.getPassword()));

        // Link availabilities back to this doctor
        List<DoctorAvailability> avails = doctor.getAvailabilities();
        if (avails != null && !avails.isEmpty()) {
            avails.forEach(a -> a.setDoctor(doctor));
        }

        doctorRepo.save(doctor);
        return ResponseEntity.ok("Doctor registered successfully");
    }

    @PostMapping("/admin")
    public ResponseEntity<?> registerAdmin(@Valid @RequestBody Admin admin) {
        admin.setPassword(passwordEncoder.encode(admin.getPassword()));
        adminRepo.save(admin);
        return ResponseEntity.ok("Admin registered successfully");
    }
}
