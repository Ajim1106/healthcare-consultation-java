package com.consultation.backend.controller;

import com.consultation.backend.model.*;
import com.consultation.backend.repository.AppointmentRepository;
import com.consultation.backend.repository.DoctorRepository;
import com.consultation.backend.repository.PatientRepository;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/appointment")
public class AppointmentController {

    private final AppointmentRepository appointmentRepo;
    private final DoctorRepository      doctorRepo;
    private final PatientRepository     patientRepo;

    public AppointmentController(AppointmentRepository appointmentRepo,
                                 DoctorRepository doctorRepo,
                                 PatientRepository patientRepo) {
        this.appointmentRepo = appointmentRepo;
        this.doctorRepo      = doctorRepo;
        this.patientRepo     = patientRepo;
    }

    // GET /api/appointment
    @GetMapping
    public ResponseEntity<?> getAll() {
        return ResponseEntity.ok(appointmentRepo.findAll());
    }

    // GET /api/appointment/{appointmentId}
    @GetMapping("/{appointmentId}")
    public ResponseEntity<?> getAppointment(@PathVariable Integer appointmentId) {
        Optional<Appointment> opt = appointmentRepo.findByIdWithDetails(appointmentId);
        if (opt.isEmpty()) return ResponseEntity.status(404).body("Appointment not found");
        Appointment a = opt.get();
        Map<String, Object> m = new HashMap<>();
        m.put("appointmentID", a.getAppointmentID());
        m.put("date",          a.getDate());
        m.put("timeSlot",      a.getTimeSlot());
        m.put("status",        a.getStatus());
        m.put("paymentStatus", a.getPaymentStatus());
        m.put("patientID",     a.getPatientID());
        m.put("doctorID",      a.getDoctorID());
        m.put("doctorName",    a.getDoctor()  != null ? a.getDoctor().getName()  : null);
        m.put("patientName",   a.getPatient() != null ? a.getPatient().getName() : null);
        return ResponseEntity.ok(m);
    }

    // GET /api/appointment/patient/{patientId}
    @GetMapping("/patient/{patientId}")
    public ResponseEntity<?> getByPatient(@PathVariable Integer patientId) {
        return ResponseEntity.ok(appointmentRepo.findByPatientIDWithDoctor(patientId));
    }

    // GET /api/appointment/patientDocterName/{patientId}
    @GetMapping("/patientDocterName/{patientId}")
    public ResponseEntity<?> getByPatientWithDoctorName(@PathVariable Integer patientId) {
        List<Map<String, Object>> result = appointmentRepo.findByPatientIDWithDoctor(patientId)
                .stream().map(a -> {
                    Map<String, Object> m = new HashMap<>();
                    m.put("appointmentID", a.getAppointmentID());
                    m.put("doctorID",      a.getDoctorID());
                    m.put("doctorName",    a.getDoctor() != null ? a.getDoctor().getName() : null);
                    m.put("patientID",     a.getPatientID());
                    m.put("date",          a.getDate());
                    m.put("timeSlot",      a.getTimeSlot());
                    m.put("status",        a.getStatus().toString());
                    m.put("paymentStatus", a.getPaymentStatus().toString());
                    return m;
                }).collect(Collectors.toList());
        return ResponseEntity.ok(result);
    }

    // GET /api/appointment/doctor/{doctorId}
    @GetMapping("/doctor/{doctorId}")
    public ResponseEntity<?> getByDoctor(@PathVariable Integer doctorId) {
        List<Map<String, Object>> result = appointmentRepo.findByDoctorIDWithPatient(doctorId)
                .stream().map(a -> {
                    Map<String, Object> m = new HashMap<>();
                    m.put("appointmentID", a.getAppointmentID());
                    m.put("date",          a.getDate());
                    m.put("timeSlot",      a.getTimeSlot());
                    m.put("status",        a.getStatus());
                    m.put("patientName",   a.getPatient() != null ? a.getPatient().getName() : null);
                    return m;
                }).collect(Collectors.toList());
        if (result.isEmpty()) {
            return ResponseEntity.status(404).body("No appointments found for doctorID " + doctorId);
        }
        return ResponseEntity.ok(result);
    }

    // GET /api/appointment/by-slot
    @GetMapping("/by-slot")
    public ResponseEntity<?> getBySlot(
            @RequestParam Integer patientId,
            @RequestParam Integer doctorId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam String timeSlot) {

        Optional<Appointment> opt = appointmentRepo
                .findByPatientIDAndDoctorIDAndDateAndTimeSlot(patientId, doctorId, date, timeSlot.trim());
        if (opt.isEmpty()) return ResponseEntity.status(404).body("No appointment found for the specified slot.");
        return ResponseEntity.ok(opt.get());
    }

    // GET /api/appointment/by-details
    @GetMapping("/by-details")
    public ResponseEntity<?> getByDetails(
            @RequestParam Integer patientId,
            @RequestParam Integer doctorId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam String timeSlot) {

        Optional<Appointment> opt = appointmentRepo
                .findByPatientIDAndDoctorIDAndDateAndTimeSlot(patientId, doctorId, date, timeSlot.trim());
        if (opt.isEmpty()) return ResponseEntity.status(404).body("No appointment found with the given details.");
        return ResponseEntity.ok(opt.get());
    }

    // POST /api/appointment
    @PostMapping
    public ResponseEntity<?> create(@RequestBody Appointment appointment) {
        try {
            Optional<Doctor> docOpt = doctorRepo.findById(appointment.getDoctorID());
            if (docOpt.isEmpty()) return ResponseEntity.badRequest().body("Doctor not found.");

            Optional<Patient> patOpt = patientRepo.findById(appointment.getPatientID());
            if (patOpt.isEmpty()) return ResponseEntity.badRequest().body("Patient not found.");

            Doctor doctor = docOpt.get();
            DayOfWeek apptDay = appointment.getDate().getDayOfWeek();
            boolean available = doctor.getAvailabilities() != null &&
                    doctor.getAvailabilities().stream()
                            .anyMatch(a -> a.getDay() == apptDay &&
                                          a.getStatus() == AvailabilityStatus.Available);
            if (!available) {
                return ResponseEntity.badRequest().body("Doctor is not available on " + apptDay);
            }

            return ResponseEntity.status(201).body(appointmentRepo.save(appointment));
        } catch (Exception ex) {
            return ResponseEntity.status(500).body("An error occurred while creating the appointment.");
        }
    }

    // PATCH /api/appointment/{id}/status
    @PatchMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Integer id, @RequestBody String status) {
        Optional<Appointment> opt = appointmentRepo.findById(id);
        if (opt.isEmpty()) return ResponseEntity.status(404).body("Appointment not found.");
        try {
            opt.get().setStatus(AppointmentStatus.valueOf(status.replace("\"", "").trim()));
            return ResponseEntity.ok(appointmentRepo.save(opt.get()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Invalid appointment status.");
        }
    }

    // PATCH /api/appointment/{id}/payment-status
    @PatchMapping("/{id}/payment-status")
    public ResponseEntity<?> updatePaymentStatus(@PathVariable Integer id, @RequestBody String status) {
        Optional<Appointment> opt = appointmentRepo.findById(id);
        if (opt.isEmpty()) return ResponseEntity.status(404).body("Appointment not found.");
        try {
            opt.get().setPaymentStatus(PaymentStatus.valueOf(status.replace("\"", "").trim()));
            return ResponseEntity.ok(appointmentRepo.save(opt.get()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Invalid payment status.");
        }
    }

    // PUT /api/appointment/{id}
    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Integer id, @RequestBody Appointment appointment) {
        if (!id.equals(appointment.getAppointmentID())) return ResponseEntity.badRequest().body("ID mismatch.");
        if (!appointmentRepo.existsById(id)) return ResponseEntity.status(404).body("Appointment not found.");
        return ResponseEntity.ok(appointmentRepo.save(appointment));
    }

    // DELETE /api/appointment/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Integer id) {
        if (!appointmentRepo.existsById(id)) return ResponseEntity.status(404).body("Appointment not found.");
        appointmentRepo.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
