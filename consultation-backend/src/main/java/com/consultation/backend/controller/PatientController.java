package com.consultation.backend.controller;

import com.consultation.backend.model.*;
import com.consultation.backend.repository.AppointmentRepository;
import com.consultation.backend.repository.PatientRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/patient")
public class PatientController {

    private final PatientRepository     patientRepo;
    private final AppointmentRepository appointmentRepo;
    private final PasswordEncoder       passwordEncoder;

    public PatientController(PatientRepository patientRepo,
                             AppointmentRepository appointmentRepo,
                             PasswordEncoder passwordEncoder) {
        this.patientRepo     = patientRepo;
        this.appointmentRepo = appointmentRepo;
        this.passwordEncoder = passwordEncoder;
    }

    // GET /api/patient/check-email  (public)
    @GetMapping("/check-email")
    public ResponseEntity<?> checkEmail(@RequestParam String email) {
        if (email == null || email.isBlank()) return ResponseEntity.badRequest().body("Email is required");
        return ResponseEntity.ok(Map.of("exists", patientRepo.existsByEmail(email)));
    }

    // GET /api/patient/{id}
    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable Integer id) {
        Optional<Patient> opt = patientRepo.findById(id);
        if (opt.isEmpty()) return ResponseEntity.status(404).body("Patient not found");
        return ResponseEntity.ok(opt.get());
    }

    // GET /api/patient/by-name/{name}
    @GetMapping("/by-name/{name}")
    public ResponseEntity<?> getByName(@PathVariable String name) {
        return ResponseEntity.ok(patientRepo.findByNameContainingIgnoreCase(name));
    }

    // GET /api/patient/all
    @GetMapping("/all")
    public ResponseEntity<?> getAll() {
        return ResponseEntity.ok(patientRepo.findAll());
    }

    // PUT /api/patient/update/{id}
    @PutMapping("/update/{id}")
    public ResponseEntity<?> updatePatient(@PathVariable Integer id, @RequestBody Patient updated) {
        Optional<Patient> opt = patientRepo.findById(id);
        if (opt.isEmpty()) return ResponseEntity.status(404).body("Patient not found");
        Patient p = opt.get();
        p.setName(updated.getName());
        p.setEmail(updated.getEmail());
        if (updated.getPassword() != null && !updated.getPassword().isBlank()) {
            p.setPassword(passwordEncoder.encode(updated.getPassword()));
        }
        p.setGender(updated.getGender());
        p.setDob(updated.getDob());
        p.setContactNumber(updated.getContactNumber());
        p.setMedicalHistory(updated.getMedicalHistory());
        p.setPatient_Image(updated.getPatient_Image());
        return ResponseEntity.ok(patientRepo.save(p));
    }

    // DELETE /api/patient/delete/{id}
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deletePatient(@PathVariable Integer id) {
        Optional<Patient> opt = patientRepo.findById(id);
        if (opt.isEmpty()) return ResponseEntity.status(404).body("Patient not found");
        patientRepo.delete(opt.get());
        return ResponseEntity.ok(Map.of("message", "Patient profile deleted successfully."));
    }

    // POST /api/patient/book-appointment
    @PostMapping("/book-appointment")
    public ResponseEntity<?> bookAppointment(@RequestBody Appointment appointment) {
        appointment.setStatus(AppointmentStatus.Booked);
        appointment.setPaymentStatus(PaymentStatus.Unpaid);
        appointmentRepo.save(appointment);
        return ResponseEntity.ok(Map.of("message", "Appointment booked successfully", "appointment", appointment));
    }

    // GET /api/patient/appointments/{patientId}
    @GetMapping("/appointments/{patientId}")
    public ResponseEntity<?> getAppointments(@PathVariable Integer patientId) {
        return ResponseEntity.ok(appointmentRepo.findByPatientIDWithDoctor(patientId));
    }

    // PUT /api/patient/update-appointment/{appointmentId}
    @PutMapping("/update-appointment/{appointmentId}")
    public ResponseEntity<?> updateAppointment(@PathVariable Integer appointmentId,
                                               @RequestBody Appointment updated) {
        Optional<Appointment> opt = appointmentRepo.findById(appointmentId);
        if (opt.isEmpty()) return ResponseEntity.status(404).body("Appointment not found");
        Appointment a = opt.get();
        a.setDate(updated.getDate());
        a.setTimeSlot(updated.getTimeSlot());
        a.setStatus(updated.getStatus());
        a.setPaymentStatus(updated.getPaymentStatus());
        return ResponseEntity.ok(appointmentRepo.save(a));
    }

    // DELETE /api/patient/cancel-appointment/{appointmentId}
    @DeleteMapping("/cancel-appointment/{appointmentId}")
    public ResponseEntity<?> cancelAppointment(@PathVariable Integer appointmentId) {
        Optional<Appointment> opt = appointmentRepo.findById(appointmentId);
        if (opt.isEmpty()) return ResponseEntity.status(404).body("Appointment not found");
        Appointment a = opt.get();
        a.setStatus(AppointmentStatus.Cancelled);
        appointmentRepo.save(a);
        return ResponseEntity.ok(Map.of("message", "Appointment cancelled."));
    }
}
