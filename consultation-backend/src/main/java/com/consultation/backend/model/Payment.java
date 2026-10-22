package com.consultation.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "payment")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer paymentID;

    private Integer appointmentID;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "appointmentID", insertable = false, updatable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer"})
    private Appointment appointment;

    private Integer patientID;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patientID", insertable = false, updatable = false)
    @JsonIgnoreProperties({"password", "hibernateLazyInitializer"})
    private Patient patient;

    @Column(precision = 18, scale = 2)
    private BigDecimal amount;

    private LocalDateTime paymentDate;

    private LocalDate endDate;

    private String paymentMode;

    private String status;

    private String razorpayOrderId;

    private String razorpayPaymentId;

    private String razorpaySignature;
}
