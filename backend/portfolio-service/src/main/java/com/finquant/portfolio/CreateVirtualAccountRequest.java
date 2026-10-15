package com.finquant.portfolio;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import java.math.BigDecimal;

public record CreateVirtualAccountRequest(
    @NotBlank String ownerName,
    @DecimalMin(value = "1.0", inclusive = true) BigDecimal initialCapital
) {
}

