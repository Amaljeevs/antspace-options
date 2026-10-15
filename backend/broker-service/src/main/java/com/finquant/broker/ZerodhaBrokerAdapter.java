package com.finquant.broker;

import java.util.Map;
import org.springframework.stereotype.Component;

@Component
public class ZerodhaBrokerAdapter implements BrokerAdapter {
    @Override
    public String brokerId() {
        return "zerodha";
    }

    @Override
    public Map<String, Object> capabilities() {
        return Map.of("paperTrading", true, "liveTrading", true, "websocket", true);
    }
}

