package com.finquant.portfolio;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "position_snapshot", schema = "portfolio")
public class PositionSnapshotEntity {
    @Id
    private UUID id;
    private String symbol;
    private int netQuantity;
    private BigDecimal mtm;
    private Instant recordedAt;

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public String getSymbol() { return symbol; }
    public void setSymbol(String symbol) { this.symbol = symbol; }
    public int getNetQuantity() { return netQuantity; }
    public void setNetQuantity(int netQuantity) { this.netQuantity = netQuantity; }
    public BigDecimal getMtm() { return mtm; }
    public void setMtm(BigDecimal mtm) { this.mtm = mtm; }
    public Instant getRecordedAt() { return recordedAt; }
    public void setRecordedAt(Instant recordedAt) { this.recordedAt = recordedAt; }
}

