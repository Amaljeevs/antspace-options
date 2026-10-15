package com.finquant.broker;

import java.util.Map;

public interface BrokerAdapter {
    String brokerId();
    Map<String, Object> capabilities();
}

