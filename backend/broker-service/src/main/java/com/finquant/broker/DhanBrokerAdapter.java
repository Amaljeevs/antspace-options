package com.finquant.broker;

import java.util.Map;
import org.springframework.stereotype.Component;

@Component
public class DhanBrokerAdapter implements BrokerAdapter {
    @Override
    public String brokerId() {
        return "dhan";
    }

    @Override
    public Map<String, Object> capabilities() {
        return Map.of("paperTrading", true, "liveTrading", true, "websocket", true);
    }
}

