package com.consultation.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "message")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Message {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer messageID;

    @NotNull
    private Integer senderID;

    @NotNull
    @Enumerated(EnumType.STRING)
    private UserType senderType;

    @NotNull
    private Integer receiverID;

    @NotNull
    @Enumerated(EnumType.STRING)
    private UserType receiverType;

    @NotNull
    private Integer appointmentID;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "appointmentID", insertable = false, updatable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer"})
    private Appointment appointment;

    private LocalDateTime timestamp = LocalDateTime.now();

    @NotBlank
    @Size(max = 1000)
    private String content;
}
