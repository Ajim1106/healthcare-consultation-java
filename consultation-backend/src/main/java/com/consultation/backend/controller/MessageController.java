package com.consultation.backend.controller;

import com.consultation.backend.model.Message;
import com.consultation.backend.repository.MessageRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/message")
public class MessageController {

    private final MessageRepository messageRepo;

    public MessageController(MessageRepository messageRepo) {
        this.messageRepo = messageRepo;
    }

    // GET /api/message
    @GetMapping
    public ResponseEntity<List<Message>> getAll() {
        return ResponseEntity.ok(messageRepo.findAll());
    }

    // GET /api/message/{appointmentId}
    @GetMapping("/{appointmentId}")
    public ResponseEntity<List<Message>> getByAppointment(@PathVariable Integer appointmentId) {
        return ResponseEntity.ok(messageRepo.findByAppointmentIDOrderByTimestampAsc(appointmentId));
    }

    // GET /api/message/single/{id}
    @GetMapping("/single/{id}")
    public ResponseEntity<?> getById(@PathVariable Integer id) {
        return messageRepo.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(404).build());
    }

    // POST /api/message
    @PostMapping
    public ResponseEntity<Message> send(@RequestBody Message message) {
        message.setTimestamp(LocalDateTime.now());
        Message saved = messageRepo.save(message);
        return ResponseEntity.status(201).body(saved);
    }

    // DELETE /api/message/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Integer id) {
        if (!messageRepo.existsById(id)) return ResponseEntity.status(404).build();
        messageRepo.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
