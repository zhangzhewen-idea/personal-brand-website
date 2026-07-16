package com.zhangzhewen.pbw.domain.shared;

import java.util.List;

public class BusinessException extends RuntimeException {

    private final String code;
    private final List<FieldViolation> fieldErrors;

    public BusinessException(String code, String detail) {
        this(code, detail, List.of());
    }

    public BusinessException(String code, String detail, List<FieldViolation> fieldErrors) {
        super(detail);
        this.code = code;
        this.fieldErrors = List.copyOf(fieldErrors);
    }

    public String code() {
        return code;
    }

    public List<FieldViolation> fieldErrors() {
        return fieldErrors;
    }

    public static BusinessException notFound(String resource, Long id) {
        String suffix = id == null ? "" : "，ID=" + id;
        return new BusinessException("RESOURCE_NOT_FOUND", resource + "不存在" + suffix);
    }

    public static BusinessException conflict(String detail) {
        return new BusinessException("RESOURCE_CONFLICT", detail);
    }

    public static BusinessException deleted(String detail) {
        return new BusinessException("RESOURCE_DELETED", detail);
    }

    public static BusinessException unauthorized(String detail) {
        return new BusinessException("UNAUTHORIZED", detail);
    }

    public static BusinessException badRequest(String detail) {
        return new BusinessException("BAD_REQUEST", detail);
    }

    public static BusinessException validation(String detail) {
        return new BusinessException("VALIDATION_ERROR", detail);
    }
}
