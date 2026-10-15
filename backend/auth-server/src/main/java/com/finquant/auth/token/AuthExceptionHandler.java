package com.finquant.auth.token;

import com.finquant.common.api.ApiEnvelope;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class AuthExceptionHandler {

    @ExceptionHandler(IllegalArgumentException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ApiEnvelope<Map<String, String>> handleIllegalArgument(IllegalArgumentException exception) {
        return new ApiEnvelope<>("error", Map.of("message", exception.getMessage()));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ApiEnvelope<Map<String, String>> handleValidation(MethodArgumentNotValidException exception) {
        return new ApiEnvelope<>("error", Map.of("message", "Request validation failed"));
    }
}

