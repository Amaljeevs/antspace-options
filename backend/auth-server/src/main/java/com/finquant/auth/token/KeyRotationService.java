package com.finquant.auth.token;

import com.finquant.auth.config.SecurityProperties;
import com.nimbusds.jose.jwk.JWKSet;
import com.nimbusds.jose.jwk.KeyUse;
import com.nimbusds.jose.jwk.RSAKey;
import jakarta.annotation.PostConstruct;
import java.security.KeyPair;
import java.security.KeyPairGenerator;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicReference;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Service
public class KeyRotationService {

    private final SecurityProperties properties;
    private final AtomicReference<KeyMaterial> active = new AtomicReference<>();
    private final AtomicReference<KeyMaterial> previous = new AtomicReference<>();

    public KeyRotationService(SecurityProperties properties) {
        this.properties = properties;
    }

    @PostConstruct
    void init() {
        active.set(generate());
    }

    @Scheduled(fixedDelayString = "86400000")
    public void rotate() {
        previous.set(active.get());
        active.set(generate());
    }

    public KeyMaterial activeKey() {
        return active.get();
    }

    public JWKSet jwkSet() {
        KeyMaterial previousKey = previous.get();
        if (previousKey == null) {
            return new JWKSet(List.of(active.get().jwk().toPublicJWK()));
        }
        return new JWKSet(List.of(active.get().jwk().toPublicJWK(), previousKey.jwk().toPublicJWK()));
    }

    private KeyMaterial generate() {
        try {
            KeyPairGenerator generator = KeyPairGenerator.getInstance("RSA");
            generator.initialize(2048);
            KeyPair pair = generator.generateKeyPair();
            String keyId = UUID.randomUUID().toString();
            RSAKey jwk = new RSAKey.Builder((java.security.interfaces.RSAPublicKey) pair.getPublic())
                .privateKey(pair.getPrivate())
                .keyID(keyId)
                .keyUse(KeyUse.SIGNATURE)
                .issueTime(java.util.Date.from(Instant.now().truncatedTo(ChronoUnit.SECONDS)))
                .build();
            return new KeyMaterial(keyId, pair, jwk, Instant.now());
        } catch (Exception exception) {
            throw new IllegalStateException("Unable to generate RSA key material", exception);
        }
    }
}
