package com.zhangzhewen.pbw.infrastructure.security;

import com.zhangzhewen.pbw.domain.gateway.TokenGateway;
import com.zhangzhewen.pbw.domain.security.AccessToken;
import com.zhangzhewen.pbw.domain.security.TokenClaims;
import com.zhangzhewen.pbw.domain.shared.BusinessException;
import com.zhangzhewen.pbw.domain.user.UserAccount;
import com.zhangzhewen.pbw.domain.user.UserAccount.UserRole;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.security.oauth2.jwt.JwtException;
import org.springframework.security.oauth2.jwt.JwsHeader;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtEncoder;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.time.Instant;
import java.util.UUID;

@Component
public class JwtTokenGatewayImpl implements TokenGateway {

    private final JwtEncoder encoder;
    private final JwtDecoder decoder;
    private final Duration tokenTtl;

    public JwtTokenGatewayImpl(
            @Value("${pbw.security.jwt-secret}") String secret,
            @Value("${pbw.security.access-token-ttl}") Duration tokenTtl
    ) {
        if (secret.getBytes(StandardCharsets.UTF_8).length < 32) {
            throw new IllegalArgumentException("JWT_SECRET 至少需要 32 字节");
        }
        SecretKey key = new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
        this.encoder = NimbusJwtEncoder.withSecretKey(key).algorithm(MacAlgorithm.HS256).build();
        this.decoder = NimbusJwtDecoder.withSecretKey(key).macAlgorithm(MacAlgorithm.HS256).build();
        this.tokenTtl = tokenTtl;
    }

    @Override
    public AccessToken issue(UserAccount user) {
        Instant now = Instant.now();
        Instant expiresAt = now.plus(tokenTtl);
        String tokenId = UUID.randomUUID().toString();
        JwtClaimsSet claims = JwtClaimsSet.builder()
                .issuer("pbw-java-backend")
                .issuedAt(now)
                .expiresAt(expiresAt)
                .subject(String.valueOf(user.base().id()))
                .id(tokenId)
                .claim("account", user.account())
                .claim("role", user.role().displayName())
                .build();
        String value = encoder.encode(JwtEncoderParameters.from(JwsHeader.with(MacAlgorithm.HS256).build(), claims)).getTokenValue();
        return new AccessToken(value, tokenId, expiresAt, tokenTtl.toSeconds());
    }

    @Override
    public TokenClaims parse(String token) {
        try {
            Jwt jwt = decoder.decode(token);
            return new TokenClaims(jwt.getId(), Long.valueOf(jwt.getSubject()), jwt.getClaimAsString("account"), UserRole.fromDisplayName(jwt.getClaimAsString("role")), jwt.getExpiresAt());
        } catch (JwtException | IllegalArgumentException exception) {
            throw BusinessException.unauthorized("访问令牌无效或已过期");
        }
    }
}
