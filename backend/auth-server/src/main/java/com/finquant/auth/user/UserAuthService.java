package com.finquant.auth.user;

import java.time.Instant;
import java.util.Locale;
import java.util.UUID;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserAuthService {

    private final AppUserRepository appUserRepository;
    private final PasswordEncoder passwordEncoder;

    public UserAuthService(AppUserRepository appUserRepository, PasswordEncoder passwordEncoder) {
        this.appUserRepository = appUserRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public UserSessionResponse register(RegisterRequest request) {
        String normalizedEmail = normalize(request.email());
        if (appUserRepository.findByEmailIgnoreCase(normalizedEmail).isPresent()) {
            throw new IllegalArgumentException("Email is already registered");
        }
        AppUserEntity entity = new AppUserEntity();
        entity.setId(UUID.randomUUID());
        entity.setEmail(normalizedEmail);
        entity.setDisplayName(request.name().trim());
        entity.setPasswordHash(passwordEncoder.encode(request.password()));
        entity.setCreatedAt(Instant.now());
        AppUserEntity saved = appUserRepository.save(entity);
        return new UserSessionResponse(saved.getEmail(), saved.getDisplayName());
    }

    public UserSessionResponse authenticate(String email, String password) {
        AppUserEntity user = appUserRepository.findByEmailIgnoreCase(normalize(email))
            .orElseThrow(() -> new IllegalArgumentException("Invalid credentials"));
        if (!passwordEncoder.matches(password, user.getPasswordHash())) {
            throw new IllegalArgumentException("Invalid credentials");
        }
        return new UserSessionResponse(user.getEmail(), user.getDisplayName());
    }

    private String normalize(String email) {
        return email.trim().toLowerCase(Locale.ROOT);
    }
}

