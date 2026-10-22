package com.consultation.backend.model;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "doctor")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Doctor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer doctorID;

    @JsonAlias({"Name", "name"})
    @NotBlank(message = "Name is required")
    private String name;

    @JsonAlias({"Email", "email"})
    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email address")
    private String email;

    @JsonAlias({"Password", "password"})
    @NotBlank(message = "Password is required")
    @Size(min = 6, max = 100)
    private String password;

    @JsonAlias({"Specialization", "specialization"})
    private String specialization;

    @JsonAlias({"Experience", "experience"})
    private Integer experience;

    @JsonAlias({"ProfileStatus", "profileStatus"})
    @Enumerated(EnumType.STRING)
    private ProfileStatus profileStatus;

    @JsonAlias({"ContactNumber", "contactNumber"})
    @NotBlank(message = "Contact number is required")
    @Pattern(regexp = "^\\d{10}$", message = "Contact number must be 10 digits")
    private String contactNumber;

    @JsonAlias({"Doctor_Image", "doctor_Image", "doctorImage"})
    private String doctor_Image;

    @JsonAlias({"Availabilities", "availabilities"})
    @OneToMany(mappedBy = "doctor", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonManagedReference
    private List<DoctorAvailability> availabilities;
}
