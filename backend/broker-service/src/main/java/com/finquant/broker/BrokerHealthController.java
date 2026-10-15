package com.finquant.broker;

import com.finquant.common.api.ApiEnvelope;
import com.finquant.common.api.HealthPayload;
import com.finquant.common.web.BaseHealthController;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class BrokerHealthController {

    private final BaseHealthController delegate;

    public BrokerHealthController(BaseHealthController delegate) {
        this.delegate = delegate;
    }

    @GetMapping("/internal/health")
    public ApiEnvelope<HealthPayload> health() {
        return delegate.health();
    }
}
