package com.zhangzhewen.pbw.adapter.common;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.MDC;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.UUID;

@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
public class RequestIdFilter extends OncePerRequestFilter {
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String incoming = request.getHeader("X-Request-Id");
        String requestId = incoming != null && incoming.matches("[A-Za-z0-9_-]{1,64}") ? incoming : "req_" + UUID.randomUUID().toString().replace("-", "");
        request.setAttribute("requestId", requestId);
        response.setHeader("X-Request-Id", requestId);
        if (request.getRequestURI().startsWith("/api/admin/")) response.setHeader("Cache-Control", "no-store");
        MDC.put("requestId", requestId);
        try {
            filterChain.doFilter(request, response);
        } finally {
            MDC.remove("requestId");
        }
    }
}
