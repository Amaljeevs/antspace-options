package com.finquant.auth.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "finquant.security")
public record SecurityProperties(
    String issuer,
    String audience,
    long accessTokenTtlMinutes,
    long refreshTokenTtlDays,
    long keyRotationHours
) {
}

