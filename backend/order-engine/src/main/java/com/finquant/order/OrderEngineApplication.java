package com.finquant.order;

import com.finquant.common.web.BaseHealthController;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication(scanBasePackages = "com.finquant")
public class OrderEngineApplication {
    public static void main(String[] args) {
        SpringApplication.run(OrderEngineApplication.class, args);
    }

    @Bean
    BaseHealthController healthController() {
        return new BaseHealthController("order-engine");
    }
}

