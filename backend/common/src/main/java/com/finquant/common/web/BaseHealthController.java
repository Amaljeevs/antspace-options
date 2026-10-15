package com.finquant.common.web;

import com.finquant.common.api.ApiEnvelope;
import com.finquant.common.api.HealthPayload;
import java.time.Instant;

public class BaseHealthController {

    private final String serviceName;

    public BaseHealthController(String serviceName) {
        this.serviceName = serviceName;
    }

    public ApiEnvelope<HealthPayload> health() {
        return ApiEnvelope.ok(new HealthPayload(serviceName, "UP", Instant.now()));
    }
}

