package com.finquant.auth.token;

import java.util.Map;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class JwksController {

    private final KeyRotationService keyRotationService;

    public JwksController(KeyRotationService keyRotationService) {
        this.keyRotationService = keyRotationService;
    }

    @GetMapping("/.well-known/jwks.json")
    public Map<String, Object> jwks() {
        return keyRotationService.jwkSet().toJSONObject();
    }
}

