package com.consultation.backend.repository;

import com.consultation.backend.model.Message;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Integer> {
    List<Message> findByAppointmentIDOrderByTimestampAsc(Integer appointmentId);
}
