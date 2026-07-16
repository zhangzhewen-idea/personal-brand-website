package com.zhangzhewen.pbw.application.dto.user;

import com.zhangzhewen.pbw.application.dto.DtoSanitizer;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public final class UserAuthDto {

    private UserAuthDto() {
    }

    public record UserLoginRequest(
            @NotBlank @Size(max = 255) String account,
            @NotBlank @Size(min = 6, max = 72) String password
    ) {
        public UserLoginRequest {
            account = DtoSanitizer.required(account);
        }
    }

    public record UserRegisterRequest(
            @NotBlank @Size(max = 255) String nickname,
            @NotBlank @Size(min = 3, max = 255) String account,
            @NotBlank @Email @Size(max = 255) String email,
            @NotBlank @Pattern(regexp = DtoSanitizer.PASSWORD_PATTERN, message = "密码须为 8-72 位且至少包含字母和数字") String password
    ) {
        public UserRegisterRequest {
            nickname = DtoSanitizer.required(nickname);
            account = DtoSanitizer.required(account);
            email = DtoSanitizer.required(email);
        }
    }

    public record UserLoginVO(String token, long expiresIn, UserProfileVO user) {
    }

    public record UserProfileVO(Long id, String nickname, String account, String email, String avatar, String role) {
    }
}
