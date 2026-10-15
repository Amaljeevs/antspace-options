package com.finquant.portfolio;

import java.math.BigDecimal;

public record PortfolioSummary(long openPositions, BigDecimal markToMarket) {
}

