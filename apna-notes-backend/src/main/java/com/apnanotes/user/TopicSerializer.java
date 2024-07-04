package com.apnanotes.user;

import java.io.IOException;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;

public class TopicSerializer extends JsonSerializer<Topic> {

    @Override
    public void serialize(Topic topic, JsonGenerator jsonGenerator, SerializerProvider serializerProvider) throws IOException {
    	jsonGenerator.writeStartObject();
        jsonGenerator.writeNumberField("id", topic.getId());
        jsonGenerator.writeStringField("name", topic.getName());
        jsonGenerator.writeEndObject();
    }
}