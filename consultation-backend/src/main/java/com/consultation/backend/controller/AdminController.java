package com.consultation.backend.controller;

import com.consultation.backend.model.Doctor;
import com.consultation.backend.model.ProfileStatus;
import com.consultation.backend.repository.AppointmentRepository;
import com.consultation.backend.repository.DoctorRepository;
import com.consultation.backend.repository.PatientRepository;
import com.consultation.backend.model.AppointmentStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final PatientRepository     patientRepo;
    private final DoctorRepository      doctorRepo;
    private final AppointmentRepository appointmentRepo;

    public AdminController(PatientRepository patientRepo, DoctorRepository doctorRepo,
                           AppointmentRepository appointmentRepo) {
        this.patientRepo     = patientRepo;
        this.doctorRepo      = doctorRepo;
        this.appointmentRepo = appointmentRepo;
    }

    // GET /api/admin/dashboard-stats
    @GetMapping("/dashboard-stats")
    public ResponseEntity<?> getDashboardStats() {
        try {
            long totalPatients         = patientRepo.count();
            long totalDoctors          = doctorRepo.count();
            long pendingApprovals      = doctorRepo.countByProfileStatus(ProfileStatus.Pending);
            long totalAppointments     = appointmentRepo.count();
            long completedAppointments = appointmentRepo.findAll().stream()
                    .filter(a -> a.getStatus() == AppointmentStatus.Completed).count();

            Map<String, Object> stats = new HashMap<>();
            stats.put("totalPatients",         totalPatients);
            stats.put("totalDoctors",          totalDoctors);
            stats.put("pendingApprovals",      pendingApprovals);
            stats.put("totalAppointments",     totalAppointments);
            stats.put("completedAppointments", completedAppointments);

            return ResponseEntity.ok(stats);
        } catch (Exception ex) {
            return ResponseEntity.status(500).body(Map.of("message", "Failed to load dashboard stats.", "error", ex.getMessage()));
        }
    }

    // GET /api/admin/pending-doctors
    @GetMapping("/pending-doctors")
    public ResponseEntity<?> getPendingDoctors() {
        try {
            List<Map<String, Object>> result = doctorRepo.findByProfileStatus(ProfileStatus.Pending)
                    .stream()
                    .map(d -> {
                        Map<String, Object> m = new HashMap<>();
                        m.put("doctorID",      d.getDoctorID());
                        m.put("name",          d.getName());
                        m.put("email",         d.getEmail());
                        m.put("specialization", d.getSpecialization());
                        m.put("profileStatus", d.getProfileStatus().name());
                        return m;
                    })
                    .collect(Collectors.toList());
            return ResponseEntity.ok(result);
        } catch (Exception ex) {
            return ResponseEntity.status(500).body(Map.of("message", "Failed to load pending doctors.", "error", ex.getMessage()));
        }
    }

    // PUT /api/admin/approve-doctor/{id}
    @PutMapping("/approve-doctor/{id}")
    public ResponseEntity<?> approveDoctor(@PathVariable Integer id) {
        try {
            Doctor doctor = doctorRepo.findById(id).orElse(null);
            if (doctor == null) return ResponseEntity.status(404).body(Map.of("message", "Doctor not found."));
            doctor.setProfileStatus(ProfileStatus.Approved);
            doctorRepo.save(doctor);
            return ResponseEntity.ok(Map.of("message", "Doctor approved successfully."));
        } catch (Exception ex) {
            return ResponseEntity.status(500).body(Map.of("message", "Failed to approve doctor.", "error", ex.getMessage()));
        }
    }
}
