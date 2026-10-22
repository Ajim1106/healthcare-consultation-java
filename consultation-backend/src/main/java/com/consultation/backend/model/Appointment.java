package com.consultation.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "appointment")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Appointment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer appointmentID;

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

    @NotNull
    private LocalDate date;

    @NotNull
    private String timeSlot;

    @NotNull
    @Enumerated(EnumType.STRING)
    private AppointmentStatus status;

    @NotNull
    @Enumerated(EnumType.STRING)
    private PaymentStatus paymentStatus;
}
