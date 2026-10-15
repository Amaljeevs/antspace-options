package com.finquant.auth;

import com.finquant.common.web.BaseHealthController;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication(scanBasePackages = "com.finquant")
@EnableScheduling
@EnableConfigurationProperties(com.finquant.auth.config.SecurityProperties.class)
public class AuthServerApplication {
    public static void main(String[] args) {
        SpringApplication.run(AuthServerApplication.class, args);
    }

    @Bean
    BaseHealthController healthController() {
        return new BaseHealthController("auth-server");
    }
}
