package com.zhangzhewen.pbw.application.dto.admin;

import com.zhangzhewen.pbw.application.dto.DtoSanitizer;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import java.time.OffsetDateTime;

public final class AdminVideoDto {

    private AdminVideoDto() {
    }

    public record AdminVideoRequest(
            @NotBlank @Size(max = 255) String videoTitle,
            @Size(max = 5000) String videoIntro,
            @NotBlank @Size(max = 1000) @Pattern(regexp = DtoSanitizer.WEB_URL_PATTERN) String videoUrl,
            @Size(max = 500) @Pattern(regexp = DtoSanitizer.WEB_URL_PATTERN) String videoCover
    ) {
        public AdminVideoRequest {
            videoTitle = DtoSanitizer.required(videoTitle);
            videoIntro = DtoSanitizer.optional(videoIntro);
            videoUrl = DtoSanitizer.required(videoUrl);
            videoCover = DtoSanitizer.optional(videoCover);
        }
    }

    public record AdminVideoVO(
            Long id,
            String videoTitle,
            String videoIntro,
            String videoUrl,
            String videoCover,
            OffsetDateTime createTime,
            OffsetDateTime updateTime,
            boolean isDeleted
    ) {
    }
}
