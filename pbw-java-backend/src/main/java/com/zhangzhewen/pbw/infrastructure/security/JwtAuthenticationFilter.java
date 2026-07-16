package com.zhangzhewen.pbw.infrastructure.security;

import tools.jackson.databind.ObjectMapper;
import com.zhangzhewen.pbw.domain.gateway.SessionGateway;
import com.zhangzhewen.pbw.domain.gateway.TokenGateway;
import com.zhangzhewen.pbw.domain.security.TokenClaims;
import com.zhangzhewen.pbw.domain.shared.BusinessException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    private final TokenGateway tokenGateway;
    private final SessionGateway sessionGateway;
    private final ObjectMapper objectMapper;

    public JwtAuthenticationFilter(TokenGateway tokenGateway, SessionGateway sessionGateway, ObjectMapper objectMapper) {
        this.tokenGateway = tokenGateway;
        this.sessionGateway = sessionGateway;
        this.objectMapper = objectMapper;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String header = request.getHeader("Authorization");
        if (header == null || !header.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }
        try {
            TokenClaims claims = tokenGateway.parse(header.substring(7));
            if (!sessionGateway.isActive(claims.tokenId(), claims.userId())) {
                throw BusinessException.unauthorized("访问令牌已失效");
            }
            PbwPrincipal principal = new PbwPrincipal(claims.userId(), claims.account(), claims.role(), claims.tokenId());
            UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(principal, null, List.of(new SimpleGrantedAuthority(claims.role().authority())));
            SecurityContextHolder.getContext().setAuthentication(authentication);
            filterChain.doFilter(request, response);
        } catch (BusinessException exception) {
            SecurityContextHolder.clearContext();
            writeUnauthorized(request, response, exception.getMessage());
        }
    }

    private void writeUnauthorized(HttpServletRequest request, HttpServletResponse response, String detail) throws IOException {
        response.setStatus(401);
        response.setContentType(MediaType.APPLICATION_PROBLEM_JSON_VALUE);
        objectMapper.writeValue(response.getOutputStream(), Map.of(
                "type", "https://pbw.example.com/problems/unauthorized",
                "title", "未认证",
                "status", 401,
                "code", "UNAUTHORIZED",
                "detail", detail,
                "instance", request.getRequestURI(),
                "requestId", String.valueOf(request.getAttribute("requestId"))
        ));
    }
}
