package com.zhangzhewen.pbw.application.dto.admin;

import com.zhangzhewen.pbw.application.dto.DtoSanitizer;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import java.time.OffsetDateTime;

public final class AdminMatrixAccountDto {

    private AdminMatrixAccountDto() {
    }

    public record AdminMatrixAccountRequest(
            @NotBlank @Size(max = 255) String platformName,
            @Size(max = 500) @Pattern(regexp = DtoSanitizer.WEB_URL_PATTERN) String platformLogo,
            @Size(max = 1000) @Pattern(regexp = DtoSanitizer.WEB_URL_PATTERN) String accountUrl,
            @Size(max = 5000) String intro
    ) {
        public AdminMatrixAccountRequest {
            platformName = DtoSanitizer.required(platformName);
            platformLogo = DtoSanitizer.optional(platformLogo);
            accountUrl = DtoSanitizer.optional(accountUrl);
            intro = DtoSanitizer.optional(intro);
        }
    }

    public record AdminMatrixAccountVO(
            Long id,
            String platformName,
            String platformLogo,
            String accountUrl,
            String intro,
            OffsetDateTime createTime,
            OffsetDateTime updateTime,
            boolean isDeleted
    ) {
    }
}
