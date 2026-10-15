package com.finquant.order;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "trade_order", schema = "orders")
public class OrderEntity {
    @Id
    private UUID id;
    private UUID accountId;
    private String strategyKey;
    private String symbol;
    private String side;
    private int quantity;
    private String status;
    private String mode;
    private BigDecimal entryPrice;
    private int lotSize;
    private BigDecimal estimatedMargin;
    private BigDecimal maximumLoss;
    private BigDecimal riskPctOfCapital;
    private Instant createdAt;

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public UUID getAccountId() { return accountId; }
    public void setAccountId(UUID accountId) { this.accountId = accountId; }
    public String getStrategyKey() { return strategyKey; }
    public void setStrategyKey(String strategyKey) { this.strategyKey = strategyKey; }
    public String getSymbol() { return symbol; }
    public void setSymbol(String symbol) { this.symbol = symbol; }
    public String getSide() { return side; }
    public void setSide(String side) { this.side = side; }
    public int getQuantity() { return quantity; }
    public void setQuantity(int quantity) { this.quantity = quantity; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getMode() { return mode; }
    public void setMode(String mode) { this.mode = mode; }
    public BigDecimal getEntryPrice() { return entryPrice; }
    public void setEntryPrice(BigDecimal entryPrice) { this.entryPrice = entryPrice; }
    public int getLotSize() { return lotSize; }
    public void setLotSize(int lotSize) { this.lotSize = lotSize; }
    public BigDecimal getEstimatedMargin() { return estimatedMargin; }
    public void setEstimatedMargin(BigDecimal estimatedMargin) { this.estimatedMargin = estimatedMargin; }
    public BigDecimal getMaximumLoss() { return maximumLoss; }
    public void setMaximumLoss(BigDecimal maximumLoss) { this.maximumLoss = maximumLoss; }
    public BigDecimal getRiskPctOfCapital() { return riskPctOfCapital; }
    public void setRiskPctOfCapital(BigDecimal riskPctOfCapital) { this.riskPctOfCapital = riskPctOfCapital; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
