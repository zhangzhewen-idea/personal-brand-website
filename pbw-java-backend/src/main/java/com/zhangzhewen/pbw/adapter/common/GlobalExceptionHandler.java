package com.zhangzhewen.pbw.adapter.common;

import com.zhangzhewen.pbw.domain.shared.BusinessException;
import com.zhangzhewen.pbw.domain.shared.FieldViolation;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.ConstraintViolationException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.HttpMediaTypeNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.multipart.MaxUploadSizeExceededException;

import java.util.List;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {
    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);
    private static final Map<String, Integer> STATUS = Map.ofEntries(
            Map.entry("BAD_REQUEST", 400), Map.entry("UNAUTHORIZED", 401), Map.entry("FORBIDDEN", 403),
            Map.entry("RESOURCE_NOT_FOUND", 404), Map.entry("RESOURCE_CONFLICT", 409), Map.entry("RESOURCE_DELETED", 409),
            Map.entry("FILE_TOO_LARGE", 413), Map.entry("UNSUPPORTED_MEDIA_TYPE", 415), Map.entry("VALIDATION_ERROR", 422),
            Map.entry("TOO_MANY_REQUESTS", 429), Map.entry("INTERNAL_ERROR", 500)
    );

    @ExceptionHandler(BusinessException.class)
    ResponseEntity<ApiProblem> handleBusiness(BusinessException exception, HttpServletRequest request) {
        int status = STATUS.getOrDefault(exception.code(), 422);
        return response(status, exception.code(), title(exception.code()), exception.getMessage(), exception.fieldErrors(), request);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    ResponseEntity<ApiProblem> handleValidation(MethodArgumentNotValidException exception, HttpServletRequest request) {
        List<FieldViolation> errors = exception.getBindingResult().getFieldErrors().stream()
                .map(error -> new FieldViolation(error.getField(), error.getDefaultMessage())).toList();
        return response(422, "VALIDATION_ERROR", "请求参数校验失败", "存在 " + errors.size() + " 个不合法字段", errors, request);
    }

    @ExceptionHandler(ConstraintViolationException.class)
    ResponseEntity<ApiProblem> handleConstraint(ConstraintViolationException exception, HttpServletRequest request) {
        List<FieldViolation> errors = exception.getConstraintViolations().stream().map(value -> new FieldViolation(value.getPropertyPath().toString(), value.getMessage())).toList();
        return response(400, "BAD_REQUEST", "请求参数错误", "查询或路径参数不合法", errors, request);
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    ResponseEntity<ApiProblem> handleUnreadable(HttpMessageNotReadableException exception, HttpServletRequest request) {
        return response(400, "BAD_REQUEST", "请求格式错误", "JSON 格式错误、包含未知字段或字段类型不正确", List.of(), request);
    }

    @ExceptionHandler(MaxUploadSizeExceededException.class)
    ResponseEntity<ApiProblem> handleUploadSize(MaxUploadSizeExceededException exception, HttpServletRequest request) {
        return response(413, "FILE_TOO_LARGE", "文件过大", "上传文件超过服务端限制", List.of(), request);
    }

    @ExceptionHandler(HttpMediaTypeNotSupportedException.class)
    ResponseEntity<ApiProblem> handleMediaType(HttpMediaTypeNotSupportedException exception, HttpServletRequest request) {
        return response(415, "UNSUPPORTED_MEDIA_TYPE", "媒体类型不支持", "请求媒体类型不受支持", List.of(), request);
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    ResponseEntity<ApiProblem> handleConflict(DataIntegrityViolationException exception, HttpServletRequest request) {
        return response(409, "RESOURCE_CONFLICT", "资源冲突", "唯一字段冲突或数据状态不允许该操作", List.of(), request);
    }

    @ExceptionHandler(Exception.class)
    ResponseEntity<ApiProblem> handleUnknown(Exception exception, HttpServletRequest request) {
        log.error("未处理的服务端异常: path={}", request.getRequestURI(), exception);
        return response(500, "INTERNAL_ERROR", "服务端错误", "服务暂时不可用", List.of(), request);
    }

    private static ResponseEntity<ApiProblem> response(int status, String code, String title, String detail, List<FieldViolation> fields, HttpServletRequest request) {
        ApiProblem problem = new ApiProblem("https://pbw.example.com/problems/" + code.toLowerCase().replace('_', '-'), title, status, code, detail, request.getRequestURI(), String.valueOf(request.getAttribute("requestId")), fields);
        return ResponseEntity.status(HttpStatus.valueOf(status)).contentType(MediaType.APPLICATION_PROBLEM_JSON).body(problem);
    }

    private static String title(String code) {
        return switch (code) {
            case "BAD_REQUEST" -> "请求参数错误";
            case "UNAUTHORIZED" -> "未认证";
            case "FORBIDDEN" -> "无访问权限";
            case "RESOURCE_NOT_FOUND" -> "资源不存在";
            case "RESOURCE_CONFLICT", "RESOURCE_DELETED" -> "资源冲突";
            case "FILE_TOO_LARGE" -> "文件过大";
            case "UNSUPPORTED_MEDIA_TYPE" -> "媒体类型不支持";
            case "TOO_MANY_REQUESTS" -> "请求过于频繁";
            default -> "请求参数校验失败";
        };
    }
}
