package com.zhangzhewen.pbw.domain.gateway;

import com.zhangzhewen.pbw.domain.security.AccessToken;

import java.time.Duration;
import java.util.Optional;

public interface SessionGateway {
    void save(Long userId, AccessToken accessToken);

    boolean isActive(String tokenId, Long userId);

    void revoke(String tokenId, Long userId);

    void revokeAll(Long userId);

    void savePasswordResetToken(String resetToken, Long userId, Duration ttl);

    Optional<Long> consumePasswordResetToken(String resetToken);
}
