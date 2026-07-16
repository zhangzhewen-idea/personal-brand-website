package com.zhangzhewen.pbw.domain.user;

import com.zhangzhewen.pbw.domain.shared.BaseEntity;

public record UserAccount(
        BaseEntity base,
        String nickname,
        String account,
        String password,
        boolean passwordConfigured,
        String email,
        String avatar,
        UserRole role
) {
    public boolean canLoginWith(String rawPassword) {
        return passwordConfigured && password != null && password.equals(rawPassword) && !base.deleted();
    }

    public enum UserRole {
        USER("用户", "ROLE_USER"),
        ADMIN("管理员", "ROLE_ADMIN");

        private final String displayName;
        private final String authority;

        UserRole(String displayName, String authority) {
            this.displayName = displayName;
            this.authority = authority;
        }

        public String displayName() {
            return displayName;
        }

        public String authority() {
            return authority;
        }

        public static UserRole fromDisplayName(String value) {
            return switch (value) {
                case "用户" -> USER;
                case "管理员" -> ADMIN;
                default -> throw new IllegalArgumentException("未知用户角色: " + value);
            };
        }
    }
}
