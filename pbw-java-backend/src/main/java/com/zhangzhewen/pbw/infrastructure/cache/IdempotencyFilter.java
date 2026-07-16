package com.zhangzhewen.pbw.infrastructure.cache;

import tools.jackson.databind.ObjectMapper;
import com.zhangzhewen.pbw.infrastructure.security.PbwPrincipal;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.http.MediaType;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.util.ContentCachingResponseWrapper;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.Duration;
import java.util.Base64;
import java.util.Map;

@Component
public class IdempotencyFilter extends OncePerRequestFilter {
    private static final Duration TTL = Duration.ofHours(24);
    private final StringRedisTemplate redis;
    private final ObjectMapper objectMapper;

    public IdempotencyFilter(StringRedisTemplate redis, ObjectMapper objectMapper) {
        this.redis = redis;
        this.objectMapper = objectMapper;
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        return !"POST".equals(request.getMethod()) || request.getHeader("Idempotency-Key") == null;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain) throws ServletException, IOException {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !(authentication.getPrincipal() instanceof PbwPrincipal principal)) {
            chain.doFilter(request, response);
            return;
        }
        String key = "pbw:idempotency:" + sha256(principal.userId() + "|" + request.getRequestURI() + "|" + request.getHeader("Idempotency-Key"));
        String cached = redis.opsForValue().get(key);
        if (cached != null && !"PROCESSING".equals(cached)) {
            replay(response, objectMapper.readValue(cached, CachedResponse.class));
            return;
        }
        Boolean acquired = redis.opsForValue().setIfAbsent(key, "PROCESSING", Duration.ofMinutes(2));
        if (!Boolean.TRUE.equals(acquired)) {
            writeConflict(request, response);
            return;
        }
        ContentCachingResponseWrapper wrapper = new ContentCachingResponseWrapper(response);
        try {
            chain.doFilter(request, wrapper);
            if (wrapper.getStatus() < 400) {
                CachedResponse result = new CachedResponse(wrapper.getStatus(), wrapper.getContentType(), wrapper.getHeader("Location"), Base64.getEncoder().encodeToString(wrapper.getContentAsByteArray()));
                redis.opsForValue().set(key, objectMapper.writeValueAsString(result), TTL);
            } else {
                redis.delete(key);
            }
        } finally {
            wrapper.copyBodyToResponse();
        }
    }

    private static String sha256(String value) {
        try {
            return java.util.HexFormat.of().formatHex(MessageDigest.getInstance("SHA-256").digest(value.getBytes(StandardCharsets.UTF_8)));
        } catch (NoSuchAlgorithmException exception) {
            throw new IllegalStateException(exception);
        }
    }

    private static void replay(HttpServletResponse response, CachedResponse cached) throws IOException {
        response.setStatus(cached.status());
        if (cached.contentType() != null) response.setContentType(cached.contentType());
        if (cached.location() != null) response.setHeader("Location", cached.location());
        response.getOutputStream().write(Base64.getDecoder().decode(cached.bodyBase64()));
    }

    private void writeConflict(HttpServletRequest request, HttpServletResponse response) throws IOException {
        response.setStatus(409);
        response.setContentType(MediaType.APPLICATION_PROBLEM_JSON_VALUE);
        objectMapper.writeValue(response.getOutputStream(), Map.of("type", "https://pbw.example.com/problems/resource-conflict", "title", "资源冲突", "status", 409, "code", "RESOURCE_CONFLICT", "detail", "相同幂等请求正在处理中", "instance", request.getRequestURI(), "requestId", String.valueOf(request.getAttribute("requestId"))));
    }

    private record CachedResponse(int status, String contentType, String location, String bodyBase64) {
    }
}
