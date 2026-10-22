package com.consultation.backend.repository;

import com.consultation.backend.model.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface AppointmentRepository extends JpaRepository<Appointment, Integer> {

    @Query("SELECT a FROM Appointment a JOIN FETCH a.doctor WHERE a.patientID = :patientId")
    List<Appointment> findByPatientIDWithDoctor(@Param("patientId") Integer patientId);

    @Query("SELECT a FROM Appointment a JOIN FETCH a.patient WHERE a.doctorID = :doctorId ORDER BY a.date")
    List<Appointment> findByDoctorIDWithPatient(@Param("doctorId") Integer doctorId);

    @Query("SELECT a FROM Appointment a JOIN FETCH a.doctor JOIN FETCH a.patient WHERE a.appointmentID = :id")
    Optional<Appointment> findByIdWithDetails(@Param("id") Integer id);

    Optional<Appointment> findByPatientIDAndDoctorIDAndDateAndTimeSlot(
            Integer patientID, Integer doctorID, LocalDate date, String timeSlot);
}
