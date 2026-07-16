package com.zhangzhewen.pbw.adapter.common;

import com.zhangzhewen.pbw.domain.shared.FieldViolation;

import java.util.List;

public record ApiProblem(
        String type,
        String title,
        int status,
        String code,
        String detail,
        String instance,
        String requestId,
        List<FieldViolation> fieldErrors
) {
    public ApiProblem {
        fieldErrors = List.copyOf(fieldErrors);
    }
}
