package com.zhangzhewen.pbw.infrastructure.cache;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Set;

@Component
@Order(Ordered.LOWEST_PRECEDENCE)
public class UserCacheControlFilter extends OncePerRequestFilter {
    private static final Set<String> PUBLIC_CONTENT_PATHS = Set.of(
            "/api/user/basic-info",
            "/api/user/videos",
            "/api/user/materials",
            "/api/user/matrix-accounts",
            "/api/user/courses"
    );

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {
        chain.doFilter(request, response);
        if ("GET".equals(request.getMethod()) && PUBLIC_CONTENT_PATHS.contains(request.getRequestURI()) && response.getStatus() < 400) {
            response.setHeader("Cache-Control", "public, max-age=60, stale-while-revalidate=300");
        } else if (request.getRequestURI().startsWith("/api/user/") && !"GET".equals(request.getMethod())) {
            response.setHeader("Cache-Control", "no-store");
        }
    }
}
