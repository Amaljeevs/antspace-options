package com.finquant.order;

import com.finquant.common.api.ApiEnvelope;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping("/estimate")
    public ApiEnvelope<MarginEstimateResponse> estimate(@Valid @RequestBody OrderRequest request) {
        return ApiEnvelope.ok(orderService.estimate(request));
    }

    @PostMapping
    public ApiEnvelope<OrderResponse> create(@Valid @RequestBody OrderRequest request) {
        return ApiEnvelope.ok(orderService.create(request));
    }

    @GetMapping
    public ApiEnvelope<List<OrderResponse>> list() {
        return ApiEnvelope.ok(orderService.list());
    }
}
