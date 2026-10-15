package com.finquant.portfolio;

import com.finquant.common.api.ApiEnvelope;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class PortfolioExceptionHandler {

    @ExceptionHandler(IllegalArgumentException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ApiEnvelope<Map<String, String>> handleIllegalArgument(IllegalArgumentException exception) {
        return new ApiEnvelope<>("error", Map.of("message", exception.getMessage()));
    }
}

