package com.zhangzhewen.pbw.infrastructure.cache;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import tools.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.time.Duration;
import java.util.Map;

@Component
public class UserRateLimitFilter extends OncePerRequestFilter {
    private static final Map<String, Limit> LIMITS = Map.of(
            "/api/user/session", new Limit(20, Duration.ofMinutes(1)),
            "/api/user/users", new Limit(10, Duration.ofHours(1)),
            "/api/user/password-reset-requests", new Limit(3, Duration.ofHours(1)),
            "/api/user/password-resets", new Limit(10, Duration.ofHours(1))
    );

    private final StringRedisTemplate redis;
    private final ObjectMapper objectMapper;

    public UserRateLimitFilter(StringRedisTemplate redis, ObjectMapper objectMapper) {
        this.redis = redis;
        this.objectMapper = objectMapper;
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        return !"POST".equals(request.getMethod()) || !LIMITS.containsKey(request.getRequestURI());
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {
        Limit limit = LIMITS.get(request.getRequestURI());
        String key = "pbw:rate-limit:" + request.getRequestURI() + ":" + clientIp(request);
        Long count = redis.opsForValue().increment(key);
        if (count != null && count == 1) {
            redis.expire(key, limit.window());
        }
        if (count != null && count > limit.requests()) {
            response.setStatus(429);
            response.setContentType(MediaType.APPLICATION_PROBLEM_JSON_VALUE);
            response.setHeader("Cache-Control", "no-store");
            response.setHeader("Retry-After", String.valueOf(limit.window().toSeconds()));
            objectMapper.writeValue(response.getOutputStream(), Map.of(
                    "type", "https://pbw.example.com/problems/too-many-requests",
                    "title", "请求过于频繁",
                    "status", 429,
                    "code", "TOO_MANY_REQUESTS",
                    "detail", "请求频率超过限制，请稍后重试",
                    "instance", request.getRequestURI(),
                    "requestId", String.valueOf(request.getAttribute("requestId"))
            ));
            return;
        }
        chain.doFilter(request, response);
    }

    private static String clientIp(HttpServletRequest request) {
        return request.getRemoteAddr();
    }

    private record Limit(long requests, Duration window) {
    }
}
