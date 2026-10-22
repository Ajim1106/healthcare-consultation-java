package com.consultation.backend.controller;

import com.consultation.backend.model.Appointment;
import com.consultation.backend.model.AppointmentStatus;
import com.consultation.backend.model.Prescription;
import com.consultation.backend.repository.AppointmentRepository;
import com.consultation.backend.repository.PrescriptionRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/prescription")
public class PrescriptionController {

    private final PrescriptionRepository prescriptionRepo;
    private final AppointmentRepository  appointmentRepo;

    public PrescriptionController(PrescriptionRepository prescriptionRepo,
                                  AppointmentRepository appointmentRepo) {
        this.prescriptionRepo = prescriptionRepo;
        this.appointmentRepo  = appointmentRepo;
    }

    // GET /api/prescription
    @GetMapping
    public ResponseEntity<List<Prescription>> getAll() {
        return ResponseEntity.ok(prescriptionRepo.findAll());
    }

    // GET /api/prescription/{id}
    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable Integer id) {
        Optional<Prescription> opt = prescriptionRepo.findById(id);
        if (opt.isEmpty()) return ResponseEntity.status(404).body("Prescription not found");
        return ResponseEntity.ok(opt.get());
    }

    // GET /api/prescription/appointment/{appointmentId}
    @GetMapping("/appointment/{appointmentId}")
    public ResponseEntity<List<Prescription>> getByAppointment(@PathVariable Integer appointmentId) {
        return ResponseEntity.ok(prescriptionRepo.findByAppointmentIDWithDetails(appointmentId));
    }

    // GET /api/prescription/patient/{patientId}
    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<Prescription>> getByPatient(@PathVariable Integer patientId) {
        return ResponseEntity.ok(prescriptionRepo.findByPatientIDWithDetails(patientId));
    }

    // GET /api/prescription/doctor/{doctorId}
    @GetMapping("/doctor/{doctorId}")
    public ResponseEntity<List<Prescription>> getByDoctor(@PathVariable Integer doctorId) {
        return ResponseEntity.ok(prescriptionRepo.findByDoctorIDWithDetails(doctorId));
    }

    // POST /api/prescription
    @PostMapping
    public ResponseEntity<?> create(@RequestBody Prescription prescription) {
        try {
            Optional<Appointment> apptOpt = appointmentRepo.findById(prescription.getAppointmentID());
            if (apptOpt.isEmpty()) return ResponseEntity.badRequest().body("Appointment not found");
            if (apptOpt.get().getStatus() != AppointmentStatus.Completed) {
                return ResponseEntity.badRequest()
                        .body("Prescriptions can only be created for completed appointments");
            }
            prescription.setDateIssued(LocalDateTime.now());
            Prescription saved = prescriptionRepo.save(prescription);
            return ResponseEntity.status(201).body(saved);
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body("Error creating prescription: " + ex.getMessage());
        }
    }

    // PUT /api/prescription/{id}
    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Integer id, @RequestBody Prescription updated) {
        Optional<Prescription> opt = prescriptionRepo.findById(id);
        if (opt.isEmpty()) return ResponseEntity.status(404).body("Prescription not found");
        Prescription p = opt.get();
        p.setMedicationDetails(updated.getMedicationDetails());
        return ResponseEntity.ok(prescriptionRepo.save(p));
    }

    // DELETE /api/prescription/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Integer id) {
        if (!prescriptionRepo.existsById(id)) return ResponseEntity.status(404).body("Prescription not found");
        prescriptionRepo.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
