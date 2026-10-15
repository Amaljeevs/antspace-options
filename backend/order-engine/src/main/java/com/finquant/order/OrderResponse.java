package com.finquant.order;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public record OrderResponse(
    UUID id,
    UUID accountId,
    String strategyKey,
    String symbol,
    String side,
    int quantity,
    String status,
    String mode,
    BigDecimal entryPrice,
    int lotSize,
    BigDecimal estimatedMargin,
    BigDecimal maximumLoss,
    BigDecimal riskPctOfCapital,
    Instant createdAt
) {
}

