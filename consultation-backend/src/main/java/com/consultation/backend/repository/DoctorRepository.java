package com.consultation.backend.repository;

import com.consultation.backend.model.Doctor;
import com.consultation.backend.model.ProfileStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface DoctorRepository extends JpaRepository<Doctor, Integer> {
    Optional<Doctor> findByEmail(String email);
    boolean existsByEmail(String email);
    List<Doctor> findByProfileStatus(ProfileStatus status);
    long countByProfileStatus(ProfileStatus status);

    @Query("SELECT d FROM Doctor d LEFT JOIN FETCH d.availabilities WHERE d.profileStatus = :status")
    List<Doctor> findAllApprovedWithAvailabilities(@Param("status") ProfileStatus status);

    @Query("SELECT d FROM Doctor d LEFT JOIN FETCH d.availabilities WHERE LOWER(d.name) LIKE LOWER(CONCAT('%',:name,'%')) AND d.profileStatus = 'Approved'")
    List<Doctor> findByNameContainingIgnoreCaseAndApproved(@Param("name") String name);

    @Query("SELECT d FROM Doctor d LEFT JOIN FETCH d.availabilities WHERE d.doctorID = :id AND d.profileStatus = 'Approved'")
    Optional<Doctor> findApprovedDoctorWithAvailabilities(@Param("id") Integer id);
}
