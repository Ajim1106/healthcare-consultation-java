package com.consultation.backend.controller;

import com.consultation.backend.model.Appointment;
import com.consultation.backend.model.Payment;
import com.consultation.backend.repository.AppointmentRepository;
import com.consultation.backend.repository.PaymentRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentRepository     paymentRepo;
    private final AppointmentRepository appointmentRepo;

    public PaymentController(PaymentRepository paymentRepo, AppointmentRepository appointmentRepo) {
        this.paymentRepo     = paymentRepo;
        this.appointmentRepo = appointmentRepo;
    }

    // GET /api/payments
    @GetMapping
    public ResponseEntity<List<Payment>> getAll() {
        return ResponseEntity.ok(paymentRepo.findAll());
    }

    // GET /api/payments/{id}
    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable Integer id) {
        Optional<Payment> opt = paymentRepo.findById(id);
        if (opt.isEmpty()) return ResponseEntity.status(404).body("Payment not found");
        return ResponseEntity.ok(opt.get());
    }

    // GET /api/payments/patient/{patientId}
    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<Payment>> getByPatient(@PathVariable Integer patientId) {
        return ResponseEntity.ok(paymentRepo.findByPatientID(patientId));
    }

    // POST /api/payments/create
    @PostMapping("/create")
    public ResponseEntity<?> create(@RequestBody Payment payment) {
        if (payment.getAppointmentID() == null || payment.getAmount() == null) {
            return ResponseEntity.badRequest().body("Invalid payment data.");
        }
        Optional<Appointment> apptOpt = appointmentRepo.findById(payment.getAppointmentID());
        if (apptOpt.isEmpty()) return ResponseEntity.status(404).body("Appointment not found.");

        payment.setPatientID(apptOpt.get().getPatientID());
        payment.setPaymentDate(LocalDateTime.now());
        if (payment.getStatus() == null) payment.setStatus("Pending");

        return ResponseEntity.status(201).body(paymentRepo.save(payment));
    }

    // PUT /api/payments/{id}
    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Integer id, @RequestBody Payment payment) {
        if (!id.equals(payment.getPaymentID())) return ResponseEntity.badRequest().body("ID mismatch.");
        if (!paymentRepo.existsById(id)) return ResponseEntity.status(404).body("Payment not found");
        return ResponseEntity.ok(paymentRepo.save(payment));
    }

    // DELETE /api/payments/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Integer id) {
        if (!paymentRepo.existsById(id)) return ResponseEntity.status(404).body("Payment not found");
        paymentRepo.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // PUT /api/payments/update-patient-ids
    @PutMapping("/update-patient-ids")
    public ResponseEntity<?> fixPatientIds() {
        try {
            List<Payment> payments = paymentRepo.findAll().stream()
                    .filter(p -> p.getPatientID() == null)
                    .toList();
            for (Payment p : payments) {
                appointmentRepo.findById(p.getAppointmentID())
                        .ifPresent(a -> p.setPatientID(a.getPatientID()));
            }
            paymentRepo.saveAll(payments);
            return ResponseEntity.ok("Updated " + payments.size() + " payments with PatientID");
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body("Error: " + ex.getMessage());
        }
    }
}
