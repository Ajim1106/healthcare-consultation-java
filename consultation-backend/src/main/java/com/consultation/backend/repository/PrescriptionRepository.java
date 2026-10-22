package com.consultation.backend.repository;

import com.consultation.backend.model.Prescription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PrescriptionRepository extends JpaRepository<Prescription, Integer> {

    @Query("SELECT p FROM Prescription p JOIN FETCH p.doctor JOIN FETCH p.patient JOIN FETCH p.appointment WHERE p.appointmentID = :id")
    List<Prescription> findByAppointmentIDWithDetails(@Param("id") Integer appointmentId);

    @Query("SELECT p FROM Prescription p JOIN FETCH p.doctor JOIN FETCH p.patient JOIN FETCH p.appointment WHERE p.patientID = :id ORDER BY p.dateIssued DESC")
    List<Prescription> findByPatientIDWithDetails(@Param("id") Integer patientId);

    @Query("SELECT p FROM Prescription p JOIN FETCH p.doctor JOIN FETCH p.patient JOIN FETCH p.appointment WHERE p.doctorID = :id ORDER BY p.dateIssued DESC")
    List<Prescription> findByDoctorIDWithDetails(@Param("id") Integer doctorId);
}
