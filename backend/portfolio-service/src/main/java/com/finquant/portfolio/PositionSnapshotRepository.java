package com.finquant.portfolio;

import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PositionSnapshotRepository extends JpaRepository<PositionSnapshotEntity, UUID> {
}

