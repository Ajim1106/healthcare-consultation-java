package com.consultation.backend.controller;

import com.consultation.backend.model.*;
import com.consultation.backend.repository.AppointmentRepository;
import com.consultation.backend.repository.DoctorAvailabilityRepository;
import com.consultation.backend.repository.DoctorRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/doctor")
public class DoctorController {

    private final DoctorRepository             doctorRepo;
    private final AppointmentRepository        appointmentRepo;
    private final DoctorAvailabilityRepository availabilityRepo;

    public DoctorController(DoctorRepository doctorRepo,
                            AppointmentRepository appointmentRepo,
                            DoctorAvailabilityRepository availabilityRepo) {
        this.doctorRepo       = doctorRepo;
        this.appointmentRepo  = appointmentRepo;
        this.availabilityRepo = availabilityRepo;
    }

    // GET /api/doctor/getAllDoctors  (public)
    @GetMapping("/getAllDoctors")
    public ResponseEntity<?> getAllDoctors() {
        List<Doctor> doctors = doctorRepo.findAllApprovedWithAvailabilities(ProfileStatus.Approved);
        return ResponseEntity.ok(buildDoctorDTOs(doctors));
    }

    // GET /api/doctor/getDoctorById/{doctorId}  (public)
    @GetMapping("/getDoctorById/{doctorId}")
    public ResponseEntity<?> getDoctorById(@PathVariable Integer doctorId) {
        Optional<Doctor> opt = doctorRepo.findApprovedDoctorWithAvailabilities(doctorId);
        if (opt.isEmpty()) return ResponseEntity.status(404).body("Doctor not found");
        return ResponseEntity.ok(buildDoctorDTO(opt.get()));
    }

    // GET /api/doctor/check-email  (public)
    @GetMapping("/check-email")
    public ResponseEntity<?> checkEmail(@RequestParam String email) {
        if (email == null || email.isBlank()) return ResponseEntity.badRequest().body("Email is required");
        return ResponseEntity.ok(Map.of("exists", doctorRepo.existsByEmail(email)));
    }

    // GET /api/doctor/doctorByName/{name}
    @GetMapping("/doctorByName/{name}")
    public ResponseEntity<?> getDoctorByName(@PathVariable String name) {
        List<Doctor> doctors = doctorRepo.findByNameContainingIgnoreCaseAndApproved(name);
        return ResponseEntity.ok(buildDoctorDTOs(doctors));
    }

    // GET /api/doctor/profile/{doctorId}
    @GetMapping("/profile/{doctorId}")
    public ResponseEntity<?> getProfile(@PathVariable Integer doctorId) {
        Optional<Doctor> opt = doctorRepo.findById(doctorId);
        if (opt.isEmpty()) return ResponseEntity.status(404).body("Doctor not found");
        return ResponseEntity.ok(opt.get());
    }

    // PUT /api/doctor/updateProfile/{doctorId}
    @PutMapping("/updateProfile/{doctorId}")
    public ResponseEntity<?> updateProfile(@PathVariable Integer doctorId, @RequestBody Doctor updated) {
        Optional<Doctor> opt = doctorRepo.findById(doctorId);
        if (opt.isEmpty()) return ResponseEntity.status(404).body("Doctor not found");
        Doctor doctor = opt.get();
        doctor.setName(updated.getName());
        doctor.setEmail(updated.getEmail());
        if (updated.getPassword() != null && !updated.getPassword().isBlank()) {
            doctor.setPassword(updated.getPassword());
        }
        doctor.setSpecialization(updated.getSpecialization());
        doctor.setExperience(updated.getExperience());
        doctor.setContactNumber(updated.getContactNumber());
        doctor.setProfileStatus(updated.getProfileStatus());
        doctor.setDoctor_Image(updated.getDoctor_Image());
        return ResponseEntity.ok(doctorRepo.save(doctor));
    }

    // GET /api/doctor/appointments/{doctorId}
    @GetMapping("/appointments/{doctorId}")
    public ResponseEntity<?> getAppointments(@PathVariable Integer doctorId) {
        return ResponseEntity.ok(appointmentRepo.findByDoctorIDWithPatient(doctorId));
    }

    // GET /api/doctor/appointmentById/{appointmentId}
    @GetMapping("/appointmentById/{appointmentId}")
    public ResponseEntity<?> getAppointmentById(@PathVariable Integer appointmentId) {
        Optional<Appointment> opt = appointmentRepo.findById(appointmentId);
        if (opt.isEmpty()) return ResponseEntity.status(404).body("Appointment not found");
        return ResponseEntity.ok(opt.get());
    }

    // PUT /api/doctor/updateAppointment/{appointmentId}
    @PutMapping("/updateAppointment/{appointmentId}")
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

    // DELETE /api/doctor/cancelAppointment/{appointmentId}
    @DeleteMapping("/cancelAppointment/{appointmentId}")
    public ResponseEntity<?> cancelAppointment(@PathVariable Integer appointmentId) {
        Optional<Appointment> opt = appointmentRepo.findById(appointmentId);
        if (opt.isEmpty()) return ResponseEntity.status(404).body("Appointment not found");
        appointmentRepo.delete(opt.get());
        return ResponseEntity.ok(Map.of("message", "Appointment cancelled."));
    }

    // GET /api/doctor/getAvailability/{doctorId}
    @GetMapping("/getAvailability/{doctorId}")
    public ResponseEntity<?> getAvailability(@PathVariable Integer doctorId) {
        List<Map<String, String>> result = availabilityRepo.findByDoctorID(doctorId)
                .stream()
                .map(this::buildAvailSlot)
                .collect(Collectors.toList());
        return ResponseEntity.ok(result);
    }

    // PUT /api/doctor/updateAvailability/{doctorId}
    @PutMapping("/updateAvailability/{doctorId}")
    public ResponseEntity<?> updateAvailability(@PathVariable Integer doctorId,
                                                @RequestBody List<DoctorAvailability> avails) {
        Optional<Doctor> opt = doctorRepo.findById(doctorId);
        if (opt.isEmpty()) return ResponseEntity.status(404).body("Doctor not found");

        List<DoctorAvailability> existing = availabilityRepo.findByDoctorID(doctorId);

        for (DoctorAvailability updated : avails) {
            if (updated.getFrom().compareTo(updated.getTo()) >= 0) {
                return ResponseEntity.badRequest()
                        .body("Invalid time range for day " + updated.getDay());
            }
            existing.stream()
                    .filter(e -> e.getDay() == updated.getDay())
                    .findFirst()
                    .ifPresentOrElse(e -> {
                        e.setFrom(updated.getFrom());
                        e.setTo(updated.getTo());
                        availabilityRepo.save(e);
                    }, () -> {
                        updated.setDoctorID(doctorId);
                        availabilityRepo.save(updated);
                    });
        }
        return ResponseEntity.ok(Map.of("message", "Availability updated successfully."));
    }

    // ---- helpers ----
    private List<Map<String, Object>> buildDoctorDTOs(List<Doctor> doctors) {
        return doctors.stream().map(this::buildDoctorDTO).collect(Collectors.toList());
    }

    private Map<String, Object> buildDoctorDTO(Doctor d) {
        Map<String, Object> dto = new HashMap<>();
        dto.put("doctorID",       d.getDoctorID());
        dto.put("name",           d.getName());
        dto.put("specialization", d.getSpecialization());
        dto.put("experience",     d.getExperience() + " years experience");
        dto.put("doctor_Image",   d.getDoctor_Image());

        // Include ALL availability slots (not just Available ones) so frontend can show schedule
        List<Map<String, String>> avails = d.getAvailabilities() == null ? List.of() :
                d.getAvailabilities().stream()
                        .map(a -> {
                            Map<String, String> m = new HashMap<>();
                            // Convert THURSDAY → Thursday (title case) so frontend comparison works
                            m.put("day",    toTitleCase(a.getDay().toString()));
                            m.put("from",   a.getFrom() != null ? a.getFrom().toString() : "");
                            m.put("to",     a.getTo()   != null ? a.getTo().toString()   : "");
                            m.put("status", a.getStatus() != null ? a.getStatus().toString() : "");
                            return m;
                        })
                        .collect(Collectors.toList());
        dto.put("availability", avails);
        return dto;
    }

    // GET /api/doctor/getAvailability/{doctorId}
    // Override to also return title-case days
    private Map<String, String> buildAvailSlot(com.consultation.backend.model.DoctorAvailability a) {
        Map<String, String> m = new HashMap<>();
        m.put("day",    toTitleCase(a.getDay().toString()));
        m.put("from",   a.getFrom() != null ? a.getFrom().toString() : "");
        m.put("to",     a.getTo()   != null ? a.getTo().toString()   : "");
        m.put("status", a.getStatus() != null ? a.getStatus().toString() : "");
        return m;
    }

    /** "THURSDAY" → "Thursday" */
    private String toTitleCase(String s) {
        if (s == null || s.isEmpty()) return s;
        return s.charAt(0) + s.substring(1).toLowerCase();
    }
}
