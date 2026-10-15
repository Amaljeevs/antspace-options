package com.finquant.portfolio;

import com.finquant.common.web.BaseHealthController;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication(scanBasePackages = "com.finquant")
public class PortfolioServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(PortfolioServiceApplication.class, args);
    }

    @Bean
    BaseHealthController healthController() {
        return new BaseHealthController("portfolio-service");
    }
}

