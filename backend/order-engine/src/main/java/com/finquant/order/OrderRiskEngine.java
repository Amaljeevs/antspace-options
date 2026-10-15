package com.finquant.order;

import java.math.BigDecimal;
import java.math.RoundingMode;
import org.springframework.stereotype.Component;

@Component
public class OrderRiskEngine {

    private static final BigDecimal ONE_HUNDRED = new BigDecimal("100");
    private static final BigDecimal ALLOW_LIMIT = new BigDecimal("10");
    private static final BigDecimal REVIEW_LIMIT = new BigDecimal("25");

    public MarginEstimateResponse estimate(OrderRequest request) {
        BigDecimal lots = BigDecimal.valueOf(request.quantity());
        BigDecimal contractQuantity = lots.multiply(BigDecimal.valueOf(request.lotSize()));
        BigDecimal notionalValue = request.entryPrice().multiply(contractQuantity);
        BigDecimal estimatedMargin = notionalValue.multiply(request.marginMultiplier()).setScale(2, RoundingMode.HALF_UP);
        BigDecimal maximumLoss = estimatedMargin.multiply(request.maxLossMultiplier()).setScale(2, RoundingMode.HALF_UP);
        BigDecimal capitalRequiredPct = percentage(maximumLoss, request.availableCapital());
        return new MarginEstimateResponse(
            request.accountId(),
            request.symbol(),
            notionalValue.setScale(2, RoundingMode.HALF_UP),
            estimatedMargin,
            maximumLoss,
            capitalRequiredPct,
            recommendation(estimatedMargin, request.availableCapital(), capitalRequiredPct)
        );
    }

    private BigDecimal percentage(BigDecimal numerator, BigDecimal denominator) {
        if (denominator.signum() <= 0) {
            return ONE_HUNDRED;
        }
        return numerator.multiply(ONE_HUNDRED).divide(denominator, 2, RoundingMode.HALF_UP);
    }

    private String recommendation(BigDecimal estimatedMargin, BigDecimal availableCapital, BigDecimal capitalRequiredPct) {
        if (estimatedMargin.compareTo(availableCapital) > 0) {
            return "REJECT";
        }
        if (capitalRequiredPct.compareTo(ALLOW_LIMIT) <= 0) {
            return "ALLOW";
        }
        if (capitalRequiredPct.compareTo(REVIEW_LIMIT) <= 0) {
            return "REVIEW";
        }
        return "REJECT";
    }
}

