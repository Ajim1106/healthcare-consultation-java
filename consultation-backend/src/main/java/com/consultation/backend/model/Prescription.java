package com.consultation.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "prescription")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Prescription {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer prescriptionID;

    @NotNull
    private Integer appointmentID;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "appointmentID", insertable = false, updatable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer"})
    private Appointment appointment;

    @NotNull
    private Integer doctorID;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "doctorID", insertable = false, updatable = false)
    @JsonIgnoreProperties({"availabilities", "password", "hibernateLazyInitializer"})
    private Doctor doctor;

    @NotNull
    private Integer patientID;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patientID", insertable = false, updatable = false)
    @JsonIgnoreProperties({"password", "hibernateLazyInitializer"})
    private Patient patient;

    private LocalDateTime dateIssued;

    @NotBlank
    private String medicationDetails;
}
