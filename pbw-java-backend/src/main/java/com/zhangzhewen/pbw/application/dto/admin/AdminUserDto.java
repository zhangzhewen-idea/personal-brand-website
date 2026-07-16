package com.zhangzhewen.pbw.application.dto.admin;

import com.zhangzhewen.pbw.application.dto.DtoSanitizer;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import java.time.OffsetDateTime;

public final class AdminUserDto {

    private AdminUserDto() {
    }

    public record AdminCreateUserRequest(
            @NotBlank @Size(max = 255) String nickname,
            @NotBlank @Size(min = 3, max = 255) String account,
            @NotBlank @Pattern(regexp = DtoSanitizer.PASSWORD_PATTERN, message = "密码须为 8-72 位且至少包含字母和数字") String password,
            @Email @Size(max = 255) String email,
            @Size(max = 500) @Pattern(regexp = DtoSanitizer.WEB_URL_PATTERN) String avatar,
            @NotBlank @Pattern(regexp = "用户|管理员") String role
    ) {
        public AdminCreateUserRequest {
            nickname = DtoSanitizer.required(nickname);
            account = DtoSanitizer.required(account);
            email = DtoSanitizer.optional(email);
            avatar = DtoSanitizer.optional(avatar);
            role = DtoSanitizer.required(role);
        }
    }

    public record AdminUpdateUserRequest(
            @NotBlank @Size(max = 255) String nickname,
            @NotBlank @Size(min = 3, max = 255) String account,
            @Pattern(regexp = DtoSanitizer.PASSWORD_PATTERN, message = "密码须为 8-72 位且至少包含字母和数字") String password,
            @Email @Size(max = 255) String email,
            @Size(max = 500) @Pattern(regexp = DtoSanitizer.WEB_URL_PATTERN) String avatar,
            @NotBlank @Pattern(regexp = "用户|管理员") String role
    ) {
        public AdminUpdateUserRequest {
            nickname = DtoSanitizer.required(nickname);
            account = DtoSanitizer.required(account);
            password = DtoSanitizer.optional(password);
            email = DtoSanitizer.optional(email);
            avatar = DtoSanitizer.optional(avatar);
            role = DtoSanitizer.required(role);
        }
    }

    public record AdminUserVO(
            Long id,
            String nickname,
            String account,
            String email,
            String avatar,
            String role,
            boolean passwordConfigured,
            OffsetDateTime createTime,
            OffsetDateTime updateTime,
            boolean isDeleted
    ) {
    }
}
