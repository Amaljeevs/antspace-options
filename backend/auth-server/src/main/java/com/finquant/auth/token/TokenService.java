package com.finquant.auth.token;

import com.finquant.auth.config.SecurityProperties;
import com.nimbusds.jose.JOSEException;
import com.nimbusds.jose.JWSAlgorithm;
import com.nimbusds.jose.JWSHeader;
import com.nimbusds.jose.crypto.RSASSASigner;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Base64;
import java.util.Date;
import java.util.HexFormat;
import java.util.List;
import java.util.UUID;
import org.springframework.stereotype.Service;

@Service
public class TokenService {

    private final SecurityProperties properties;
    private final KeyRotationService keyRotationService;
    private final RefreshTokenRepository refreshTokenRepository;

    public TokenService(
        SecurityProperties properties,
        KeyRotationService keyRotationService,
        RefreshTokenRepository refreshTokenRepository
    ) {
        this.properties = properties;
        this.keyRotationService = keyRotationService;
        this.refreshTokenRepository = refreshTokenRepository;
    }

    public TokenResponse issue(String subject, String name) {
        String accessToken = sign(subject, name, properties.accessTokenTtlMinutes(), "access");
        String refreshToken = UUID.randomUUID() + "." + Base64.getUrlEncoder().withoutPadding().encodeToString(subject.getBytes(StandardCharsets.UTF_8));
        RefreshTokenEntity entity = new RefreshTokenEntity();
        entity.setId(UUID.randomUUID());
        entity.setSubject(subject);
        entity.setTokenHash(hash(refreshToken));
        entity.setCreatedAt(Instant.now());
        entity.setExpiresAt(Instant.now().plus(properties.refreshTokenTtlDays(), ChronoUnit.DAYS));
        refreshTokenRepository.save(entity);
        return new TokenResponse(accessToken, refreshToken, "Bearer", properties.accessTokenTtlMinutes() * 60);
    }

    public TokenResponse refresh(String refreshToken) {
        RefreshTokenEntity entity = refreshTokenRepository.findByTokenHash(hash(refreshToken))
            .filter(token -> token.getRevokedAt() == null && token.getExpiresAt().isAfter(Instant.now()))
            .orElseThrow(() -> new IllegalArgumentException("Refresh token is invalid or expired"));
        entity.setRevokedAt(Instant.now());
        refreshTokenRepository.save(entity);
        return issue(entity.getSubject(), entity.getSubject());
    }

    private String sign(String subject, String name, long ttlMinutes, String scope) {
        KeyMaterial material = keyRotationService.activeKey();
        Instant now = Instant.now();
        JWTClaimsSet claims = new JWTClaimsSet.Builder()
            .issuer(properties.issuer())
            .audience(List.of(properties.audience()))
            .subject(subject)
            .issueTime(Date.from(now))
            .expirationTime(Date.from(now.plus(ttlMinutes, ChronoUnit.MINUTES)))
            .claim("scope", scope)
            .claim("name", name)
            .jwtID(UUID.randomUUID().toString())
            .build();
        SignedJWT signedJWT = new SignedJWT(new JWSHeader.Builder(JWSAlgorithm.RS256).keyID(material.keyId()).build(), claims);
        try {
            signedJWT.sign(new RSASSASigner(material.keyPair().getPrivate()));
        } catch (JOSEException exception) {
            throw new IllegalStateException("Unable to sign JWT", exception);
        }
        return signedJWT.serialize();
    }

    private String hash(String input) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            return HexFormat.of().formatHex(digest.digest(input.getBytes(StandardCharsets.UTF_8)));
        } catch (Exception exception) {
            throw new IllegalStateException("Unable to hash token", exception);
        }
    }
}
