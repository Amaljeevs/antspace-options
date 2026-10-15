package com.finquant.auth.token;

import com.finquant.auth.user.RegisterRequest;
import com.finquant.auth.user.UserAuthService;
import com.finquant.auth.user.UserSessionResponse;
import com.finquant.common.api.ApiEnvelope;
import jakarta.validation.Valid;
import java.util.Map;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final TokenService tokenService;
    private final KeyRotationService keyRotationService;
    private final UserAuthService userAuthService;

    public AuthController(TokenService tokenService, KeyRotationService keyRotationService, UserAuthService userAuthService) {
        this.tokenService = tokenService;
        this.keyRotationService = keyRotationService;
        this.userAuthService = userAuthService;
    }

    @PostMapping("/token")
    public ApiEnvelope<TokenResponse> token(@Valid @RequestBody TokenRequest request) {
        if ("demo".equalsIgnoreCase(request.username()) && "demo123".equals(request.password())) {
            return ApiEnvelope.ok(tokenService.issue("demo", "Demo User"));
        }
        UserSessionResponse user = userAuthService.authenticate(request.username(), request.password());
        return ApiEnvelope.ok(tokenService.issue(user.email(), user.name()));
    }

    @PostMapping("/register")
    public ApiEnvelope<TokenResponse> register(@Valid @RequestBody RegisterRequest request) {
        UserSessionResponse user = userAuthService.register(request);
        return ApiEnvelope.ok(tokenService.issue(user.email(), user.name()));
    }

    @PostMapping("/refresh")
    public ApiEnvelope<TokenResponse> refresh(@Valid @RequestBody RefreshRequest request) {
        return ApiEnvelope.ok(tokenService.refresh(request.refreshToken()));
    }

    @GetMapping(value = "/config", produces = MediaType.APPLICATION_JSON_VALUE)
    public ApiEnvelope<Map<String, String>> config() {
        return ApiEnvelope.ok(Map.of("demoUser", "demo", "demoPassword", "demo123"));
    }

    @GetMapping("/jwks")
    public ApiEnvelope<Map<String, Object>> jwksMirror() {
        return ApiEnvelope.ok(keyRotationService.jwkSet().toJSONObject());
    }
}
