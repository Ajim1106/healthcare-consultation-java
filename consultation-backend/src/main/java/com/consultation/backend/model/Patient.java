package com.consultation.backend.model;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "patient")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Patient {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer patientID;

    @JsonAlias({"Name", "name"})
    @NotBlank(message = "Name is required")
    @Size(min = 2, max = 100)
    private String name;

    @JsonAlias({"Email", "email"})
    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email address")
    private String email;

    @JsonAlias({"Password", "password"})
    @NotBlank(message = "Password is required")
    @Size(min = 6, max = 100)
    private String password;

    @JsonAlias({"Gender", "gender"})
    @NotNull(message = "Gender is required")
    @Enumerated(EnumType.STRING)
    @JsonDeserialize(using = GenderDeserializer.class)
    private Gender gender;

    @JsonAlias({"DOB", "dob", "Dob"})
    @NotNull(message = "Date of Birth is required")
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate dob;

    @JsonAlias({"ContactNumber", "contactNumber"})
    @NotBlank(message = "Contact number is required")
    @Pattern(regexp = "^\\d{10}$", message = "Contact number must be 10 digits")
    private String contactNumber;

    @JsonAlias({"MedicalHistory", "medicalHistory"})
    @Size(max = 1000)
    private String medicalHistory;

    @JsonAlias({"Patient_Image", "patient_Image", "patientImage"})
    private String patient_Image;
}
