package com.consultation.backend.repository;

import com.consultation.backend.model.Patient;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PatientRepository extends JpaRepository<Patient, Integer> {
    Optional<Patient> findByEmail(String email);
    boolean existsByEmail(String email);
    List<Patient> findByNameContainingIgnoreCase(String name);
}
