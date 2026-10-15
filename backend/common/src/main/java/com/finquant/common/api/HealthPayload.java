package com.finquant.common.api;

import java.time.Instant;

public record HealthPayload(String service, String status, Instant timestamp) {
}

