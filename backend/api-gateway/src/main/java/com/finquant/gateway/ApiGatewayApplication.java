package com.finquant.gateway;

import com.finquant.common.web.BaseHealthController;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication(scanBasePackages = "com.finquant")
public class ApiGatewayApplication {
    public static void main(String[] args) {
        SpringApplication.run(ApiGatewayApplication.class, args);
    }

    @Bean
    BaseHealthController healthController() {
        return new BaseHealthController("api-gateway");
    }
}

