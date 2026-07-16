package com.zhangzhewen.pbw.application.dto.admin;

import com.zhangzhewen.pbw.application.dto.DtoSanitizer;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public final class AdminAuthDto {

    private AdminAuthDto() {
    }

    public record AdminLoginRequest(
            @NotBlank @Size(max = 255) String account,
            @NotBlank @Size(min = 6, max = 72) String password
    ) {
        public AdminLoginRequest {
            account = DtoSanitizer.required(account);
        }
    }

    public record AdminLoginVO(String token, long expiresIn, String nickname, String role) {
    }

    public record AdminSessionVO(Long id, String nickname, String account, String email, String avatar, String role) {
    }

    public record AdminPasswordResetRequest(@NotBlank @Size(max = 255) String accountOrEmail) {
        public AdminPasswordResetRequest {
            accountOrEmail = DtoSanitizer.required(accountOrEmail);
        }
    }

    public record AdminPasswordResetAcceptedVO(boolean accepted, long expiresIn) {
    }

    public record AdminPasswordResetConfirmRequest(
            @NotBlank String resetToken,
            @NotBlank @Pattern(regexp = DtoSanitizer.PASSWORD_PATTERN, message = "密码须为 8-72 位且至少包含字母和数字") String newPassword
    ) {
        public AdminPasswordResetConfirmRequest {
            resetToken = DtoSanitizer.required(resetToken);
        }
    }

    public record AdminPasswordResetResultVO(boolean success) {
    }
}
