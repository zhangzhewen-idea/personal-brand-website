package com.zhangzhewen.pbw.domain.security;

import java.time.Instant;

public record AccessToken(String token, String tokenId, Instant expiresAt, long expiresIn) {
}
