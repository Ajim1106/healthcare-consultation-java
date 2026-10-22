package com.consultation.backend.model;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;

import java.io.IOException;

/**
 * Handles both integer (0=Male,1=Female,2=Other) and string ("Male","Female","Other")
 * coming from the frontend form.
 */
public class GenderDeserializer extends JsonDeserializer<Gender> {
    @Override
    public Gender deserialize(JsonParser p, DeserializationContext ctx) throws IOException {
        String value = p.getText().trim();
        return switch (value) {
            case "0", "Male"   -> Gender.Male;
            case "1", "Female" -> Gender.Female;
            case "2", "Other"  -> Gender.Other;
            default -> throw new IllegalArgumentException("Unknown gender value: " + value);
        };
    }
}
