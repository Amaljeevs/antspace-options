package com.finquant.portfolio;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Instant;
import java.util.List;
import java.util.UUID;
import org.springframework.stereotype.Service;

@Service
public class VirtualAccountService {

    private static final BigDecimal ONE_HUNDRED = new BigDecimal("100");
    private static final BigDecimal LOW_RISK_LIMIT = new BigDecimal("10");
    private static final BigDecimal REVIEW_RISK_LIMIT = new BigDecimal("25");

    private final VirtualAccountRepository repository;

    public VirtualAccountService(VirtualAccountRepository repository) {
        this.repository = repository;
    }

    public VirtualAccountResponse create(CreateVirtualAccountRequest request) {
        VirtualAccountEntity entity = new VirtualAccountEntity();
        entity.setId(UUID.randomUUID());
        entity.setOwnerName(request.ownerName());
        entity.setInitialCapital(request.initialCapital());
        entity.setAvailableCash(request.initialCapital());
        entity.setUsedMargin(BigDecimal.ZERO);
        entity.setRealizedPnl(BigDecimal.ZERO);
        entity.setUnrealizedPnl(BigDecimal.ZERO);
        entity.setCreatedAt(Instant.now());
        return toResponse(repository.save(entity));
    }

    public List<VirtualAccountResponse> list() {
        return repository.findAll().stream().map(this::toResponse).toList();
    }

    public RiskAllocationResponse estimate(UUID accountId, BigDecimal estimatedMargin, BigDecimal maximumLoss) {
        VirtualAccountEntity account = repository.findById(accountId)
            .orElseThrow(() -> new IllegalArgumentException("Virtual account not found"));
        BigDecimal equity = equity(account);
        BigDecimal freeMarginAfterTrade = account.getAvailableCash().subtract(estimatedMargin);
        BigDecimal marginUtilizationPct = percentage(estimatedMargin, equity);
        BigDecimal riskPctOfCapital = percentage(maximumLoss, equity);
        String recommendation = recommendation(freeMarginAfterTrade, riskPctOfCapital);
        return new RiskAllocationResponse(
            account.getId(),
            equity,
            estimatedMargin,
            maximumLoss,
            freeMarginAfterTrade,
            marginUtilizationPct,
            riskPctOfCapital,
            recommendation
        );
    }

    private VirtualAccountResponse toResponse(VirtualAccountEntity entity) {
        BigDecimal equity = equity(entity);
        BigDecimal freeMargin = entity.getAvailableCash().subtract(entity.getUsedMargin());
        return new VirtualAccountResponse(
            entity.getId(),
            entity.getOwnerName(),
            entity.getInitialCapital(),
            entity.getAvailableCash(),
            entity.getUsedMargin(),
            entity.getRealizedPnl(),
            entity.getUnrealizedPnl(),
            equity,
            freeMargin,
            entity.getCreatedAt()
        );
    }

    private BigDecimal equity(VirtualAccountEntity entity) {
        return entity.getAvailableCash()
            .add(entity.getUsedMargin())
            .add(entity.getRealizedPnl())
            .add(entity.getUnrealizedPnl());
    }

    private BigDecimal percentage(BigDecimal numerator, BigDecimal denominator) {
        if (denominator.signum() <= 0) {
            return ONE_HUNDRED;
        }
        return numerator.multiply(ONE_HUNDRED).divide(denominator, 2, RoundingMode.HALF_UP);
    }

    private String recommendation(BigDecimal freeMarginAfterTrade, BigDecimal riskPctOfCapital) {
        if (freeMarginAfterTrade.signum() < 0) {
            return "REJECT";
        }
        if (riskPctOfCapital.compareTo(LOW_RISK_LIMIT) <= 0) {
            return "ALLOW";
        }
        if (riskPctOfCapital.compareTo(REVIEW_RISK_LIMIT) <= 0) {
            return "REVIEW";
        }
        return "REJECT";
    }
}

