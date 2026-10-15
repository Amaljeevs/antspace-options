package com.finquant.portfolio;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public record VirtualAccountResponse(
    UUID id,
    String ownerName,
    BigDecimal initialCapital,
    BigDecimal availableCash,
    BigDecimal usedMargin,
    BigDecimal realizedPnl,
    BigDecimal unrealizedPnl,
    BigDecimal equity,
    BigDecimal freeMargin,
    Instant createdAt
) {
}

