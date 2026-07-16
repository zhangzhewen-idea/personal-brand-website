package com.zhangzhewen.pbw.domain.security;

import com.zhangzhewen.pbw.domain.user.UserAccount.UserRole;

import java.time.Instant;

public record TokenClaims(String tokenId, Long userId, String account, UserRole role, Instant expiresAt) {
}
