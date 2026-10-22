package com.consultation.backend.model;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;

import java.io.IOException;
import java.time.DayOfWeek;

/**
 * Handles "Monday", "MONDAY", "monday" → DayOfWeek.MONDAY etc.
 */
public class DayOfWeekDeserializer extends JsonDeserializer<DayOfWeek> {
    @Override
    public DayOfWeek deserialize(JsonParser p, DeserializationContext ctx) throws IOException {
        return DayOfWeek.valueOf(p.getText().trim().toUpperCase());
    }
}
