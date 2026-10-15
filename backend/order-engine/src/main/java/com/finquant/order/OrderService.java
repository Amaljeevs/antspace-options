package com.finquant.order;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.UUID;
import org.springframework.stereotype.Service;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderRiskEngine orderRiskEngine;

    public OrderService(OrderRepository orderRepository, OrderRiskEngine orderRiskEngine) {
        this.orderRepository = orderRepository;
        this.orderRiskEngine = orderRiskEngine;
    }

    public MarginEstimateResponse estimate(OrderRequest request) {
        return orderRiskEngine.estimate(request);
    }

    public OrderResponse create(OrderRequest request) {
        MarginEstimateResponse estimate = orderRiskEngine.estimate(request);
        if ("REJECT".equals(estimate.recommendation())) {
            throw new IllegalArgumentException("Trade rejected because estimated risk exceeds available capital");
        }
        OrderEntity entity = new OrderEntity();
        entity.setId(UUID.randomUUID());
        entity.setAccountId(request.accountId());
        entity.setStrategyKey(request.strategyKey());
        entity.setSymbol(request.symbol());
        entity.setSide(request.side());
        entity.setQuantity(request.quantity());
        entity.setMode(request.mode());
        entity.setEntryPrice(request.entryPrice());
        entity.setLotSize(request.lotSize());
        entity.setEstimatedMargin(estimate.estimatedMargin());
        entity.setMaximumLoss(estimate.maximumLoss());
        entity.setRiskPctOfCapital(estimate.capitalRequiredPct());
        entity.setStatus("ACCEPTED");
        entity.setCreatedAt(Instant.now());
        return toResponse(orderRepository.save(entity));
    }

    public List<OrderResponse> list() {
        return orderRepository.findAll().stream().map(this::toResponse).toList();
    }

    private OrderResponse toResponse(OrderEntity entity) {
        return new OrderResponse(
            entity.getId(),
            entity.getAccountId(),
            entity.getStrategyKey(),
            entity.getSymbol(),
            entity.getSide(),
            entity.getQuantity(),
            entity.getStatus(),
            entity.getMode(),
            defaultIfNull(entity.getEntryPrice()),
            entity.getLotSize(),
            defaultIfNull(entity.getEstimatedMargin()),
            defaultIfNull(entity.getMaximumLoss()),
            defaultIfNull(entity.getRiskPctOfCapital()),
            entity.getCreatedAt()
        );
    }

    private BigDecimal defaultIfNull(BigDecimal value) {
        return value == null ? BigDecimal.ZERO : value;
    }
}
