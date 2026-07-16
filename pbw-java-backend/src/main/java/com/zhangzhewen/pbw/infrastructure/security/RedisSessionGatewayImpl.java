package com.zhangzhewen.pbw.infrastructure.security;

import com.zhangzhewen.pbw.domain.gateway.SessionGateway;
import com.zhangzhewen.pbw.domain.security.AccessToken;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.time.Instant;
import java.util.Optional;
import java.util.Set;

@Component
public class RedisSessionGatewayImpl implements SessionGateway {

    private static final String SESSION_PREFIX = "pbw:session:";
    private static final String USER_SESSIONS_PREFIX = "pbw:user-sessions:";
    private static final String RESET_PREFIX = "pbw:password-reset:";
    private final StringRedisTemplate redis;

    public RedisSessionGatewayImpl(StringRedisTemplate redis) {
        this.redis = redis;
    }

    @Override
    public void save(Long userId, AccessToken token) {
        Duration ttl = Duration.between(Instant.now(), token.expiresAt());
        redis.opsForValue().set(SESSION_PREFIX + token.tokenId(), String.valueOf(userId), ttl);
        String userKey = USER_SESSIONS_PREFIX + userId;
        redis.opsForSet().add(userKey, token.tokenId());
        redis.expire(userKey, ttl.plusMinutes(1));
    }

    @Override
    public boolean isActive(String tokenId, Long userId) {
        return String.valueOf(userId).equals(redis.opsForValue().get(SESSION_PREFIX + tokenId));
    }

    @Override
    public void revoke(String tokenId, Long userId) {
        redis.delete(SESSION_PREFIX + tokenId);
        redis.opsForSet().remove(USER_SESSIONS_PREFIX + userId, tokenId);
    }

    @Override
    public void revokeAll(Long userId) {
        String userKey = USER_SESSIONS_PREFIX + userId;
        Set<String> tokenIds = redis.opsForSet().members(userKey);
        if (tokenIds != null && !tokenIds.isEmpty()) {
            redis.delete(tokenIds.stream().map(id -> SESSION_PREFIX + id).toList());
        }
        redis.delete(userKey);
    }

    @Override
    public void savePasswordResetToken(String resetToken, Long userId, Duration ttl) {
        redis.opsForValue().set(RESET_PREFIX + resetToken, String.valueOf(userId), ttl);
    }

    @Override
    public Optional<Long> consumePasswordResetToken(String resetToken) {
        String value = redis.opsForValue().getAndDelete(RESET_PREFIX + resetToken);
        return value == null ? Optional.empty() : Optional.of(Long.valueOf(value));
    }
}
