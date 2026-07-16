package com.zhangzhewen.pbw.infrastructure.security;

import com.zhangzhewen.pbw.domain.user.UserAccount.UserRole;

public record PbwPrincipal(Long userId, String account, UserRole role, String tokenId) {
}
