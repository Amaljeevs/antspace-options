package com.finquant.broker;

import com.finquant.common.api.ApiEnvelope;
import java.util.List;
import java.util.Map;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/brokers")
public class BrokerCatalogController {

    private final List<BrokerAdapter> adapters;

    public BrokerCatalogController(List<BrokerAdapter> adapters) {
        this.adapters = adapters;
    }

    @GetMapping
    public ApiEnvelope<List<Map<String, Object>>> list() {
        return ApiEnvelope.ok(
            adapters.stream()
                .map(adapter -> Map.<String, Object>of(
                    "brokerId", adapter.brokerId(),
                    "capabilities", adapter.capabilities()
                ))
                .toList()
        );
    }
}

