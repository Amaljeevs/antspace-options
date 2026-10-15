package com.finquant.portfolio;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "virtual_account", schema = "portfolio")
public class VirtualAccountEntity {
    @Id
    private UUID id;

    @Column(nullable = false)
    private String ownerName;

    @Column(nullable = false)
    private BigDecimal initialCapital;

    @Column(nullable = false)
    private BigDecimal availableCash;

    @Column(nullable = false)
    private BigDecimal usedMargin;

    @Column(nullable = false)
    private BigDecimal realizedPnl;

    @Column(nullable = false)
    private BigDecimal unrealizedPnl;

    @Column(nullable = false)
    private Instant createdAt;

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public String getOwnerName() { return ownerName; }
    public void setOwnerName(String ownerName) { this.ownerName = ownerName; }
    public BigDecimal getInitialCapital() { return initialCapital; }
    public void setInitialCapital(BigDecimal initialCapital) { this.initialCapital = initialCapital; }
    public BigDecimal getAvailableCash() { return availableCash; }
    public void setAvailableCash(BigDecimal availableCash) { this.availableCash = availableCash; }
    public BigDecimal getUsedMargin() { return usedMargin; }
    public void setUsedMargin(BigDecimal usedMargin) { this.usedMargin = usedMargin; }
    public BigDecimal getRealizedPnl() { return realizedPnl; }
    public void setRealizedPnl(BigDecimal realizedPnl) { this.realizedPnl = realizedPnl; }
    public BigDecimal getUnrealizedPnl() { return unrealizedPnl; }
    public void setUnrealizedPnl(BigDecimal unrealizedPnl) { this.unrealizedPnl = unrealizedPnl; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}

