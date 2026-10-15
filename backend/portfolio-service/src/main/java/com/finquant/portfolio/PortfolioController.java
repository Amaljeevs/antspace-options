package com.finquant.portfolio;

import com.finquant.common.api.ApiEnvelope;
import jakarta.validation.Valid;
import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/portfolio")
public class PortfolioController {

    private final PositionSnapshotRepository repository;
    private final VirtualAccountService virtualAccountService;

    public PortfolioController(PositionSnapshotRepository repository, VirtualAccountService virtualAccountService) {
        this.repository = repository;
        this.virtualAccountService = virtualAccountService;
    }

    @GetMapping("/positions")
    public ApiEnvelope<List<PositionSnapshotEntity>> positions() {
        return ApiEnvelope.ok(repository.findAll());
    }

    @GetMapping("/summary")
    public ApiEnvelope<PortfolioSummary> summary() {
        List<PositionSnapshotEntity> positions = repository.findAll();
        BigDecimal mtm = positions.stream()
            .map(PositionSnapshotEntity::getMtm)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        return ApiEnvelope.ok(new PortfolioSummary(positions.size(), mtm));
    }

    @PostMapping("/accounts")
    public ApiEnvelope<VirtualAccountResponse> createAccount(@Valid @RequestBody CreateVirtualAccountRequest request) {
        return ApiEnvelope.ok(virtualAccountService.create(request));
    }

    @GetMapping("/accounts")
    public ApiEnvelope<List<VirtualAccountResponse>> accounts() {
        return ApiEnvelope.ok(virtualAccountService.list());
    }

    @GetMapping("/accounts/{accountId}/risk-allocation")
    public ApiEnvelope<RiskAllocationResponse> riskAllocation(
        @PathVariable UUID accountId,
        @RequestParam BigDecimal estimatedMargin,
        @RequestParam BigDecimal maximumLoss
    ) {
        return ApiEnvelope.ok(virtualAccountService.estimate(accountId, estimatedMargin, maximumLoss));
    }
}
