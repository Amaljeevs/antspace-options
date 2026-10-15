package com.finquant.auth.token;

import com.nimbusds.jose.jwk.RSAKey;
import java.security.KeyPair;
import java.time.Instant;

public record KeyMaterial(String keyId, KeyPair keyPair, RSAKey jwk, Instant createdAt) {
}

