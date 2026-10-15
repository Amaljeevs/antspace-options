package com.finquant.order;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.util.UUID;

public record OrderRequest(
    @NotNull UUID accountId,
    @NotBlank String strategyKey,
    @NotBlank String symbol,
    @NotBlank String side,
    @Min(1) int quantity,
    @NotBlank String mode,
    @NotNull BigDecimal entryPrice,
    @Min(1) int lotSize,
    @NotNull BigDecimal availableCapital,
    @NotNull BigDecimal marginMultiplier,
    @NotNull BigDecimal maxLossMultiplier
) {
}
