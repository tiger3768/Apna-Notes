package com.apnanotes.user;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;
import java.io.IOException;

public class OrganisationSerializer extends JsonSerializer<Organisation> {

    @Override
    public void serialize(Organisation organisation, JsonGenerator jsonGenerator, SerializerProvider serializerProvider) throws IOException {
    	jsonGenerator.writeStartObject();
        jsonGenerator.writeStringField("organisationType", organisation.getOrganisationType());
        jsonGenerator.writeStringField("name", organisation.getName());
        jsonGenerator.writeEndObject();
    }
}
