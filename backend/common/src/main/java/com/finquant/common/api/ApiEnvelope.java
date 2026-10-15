package com.finquant.common.api;

public record ApiEnvelope<T>(String status, T data) {
    public static <T> ApiEnvelope<T> ok(T data) {
        return new ApiEnvelope<>("ok", data);
    }
}

