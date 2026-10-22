package com.consultation.backend.model;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import jakarta.persistence.*;
import lombok.*;

import java.time.DayOfWeek;
import java.time.LocalTime;

@Entity
@Table(name = "doctor_availability")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class DoctorAvailability {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "doctor_availabilityid")
    private Integer doctorAvailabilityID;

    @Column(name = "doctorid")
    private Integer doctorID;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "doctorid", insertable = false, updatable = false)
    @JsonBackReference
    private Doctor doctor;

    @JsonAlias({"Day", "day"})
    @JsonDeserialize(using = DayOfWeekDeserializer.class)
    @Enumerated(EnumType.STRING)
    @Column(name = "day_of_week")
    private DayOfWeek day;

    @JsonAlias({"From", "from"})
    @JsonFormat(pattern = "HH:mm:ss")
    @Column(name = "from_time")
    private LocalTime from;

    @JsonAlias({"To", "to"})
    @JsonFormat(pattern = "HH:mm:ss")
    @Column(name = "to_time")
    private LocalTime to;

    @JsonAlias({"Status", "status"})
    @Enumerated(EnumType.STRING)
    @Column(name = "avail_status")
    private AvailabilityStatus status;
}
