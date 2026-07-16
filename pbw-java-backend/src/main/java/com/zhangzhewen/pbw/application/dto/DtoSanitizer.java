package com.zhangzhewen.pbw.application.dto;

public final class DtoSanitizer {

    public static final String WEB_URL_PATTERN = "^(https://.+|http://localhost(?::[0-9]{1,5})?/.+)$";
    public static final String PASSWORD_PATTERN = "^(?=.*[A-Za-z])(?=.*[0-9]).{8,72}$";

    private DtoSanitizer() {
    }

    public static String required(String value) {
        return value == null ? null : value.trim();
    }

    public static String optional(String value) {
        if (value == null) {
            return null;
        }
        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }
}
