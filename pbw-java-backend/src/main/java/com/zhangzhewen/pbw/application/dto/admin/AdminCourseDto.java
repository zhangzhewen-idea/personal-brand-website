package com.zhangzhewen.pbw.application.dto.admin;

import com.zhangzhewen.pbw.application.dto.DtoSanitizer;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

public final class AdminCourseDto {

    private AdminCourseDto() {
    }

    public record AdminCourseRequest(
            @NotBlank @Size(max = 255) String courseName,
            @Size(max = 255) String courseTag,
            @Size(max = 5000) String courseIntro,
            @NotNull @DecimalMin("0.00") @DecimalMax("99999999.99") BigDecimal coursePrice,
            @NotNull Boolean isOnline
    ) {
        public AdminCourseRequest {
            courseName = DtoSanitizer.required(courseName);
            courseTag = DtoSanitizer.optional(courseTag);
            courseIntro = DtoSanitizer.optional(courseIntro);
        }
    }

    public record AdminCourseVO(
            Long id,
            String courseName,
            String courseTag,
            String courseIntro,
            BigDecimal coursePrice,
            boolean isOnline,
            OffsetDateTime createTime,
            OffsetDateTime updateTime,
            boolean isDeleted
    ) {
    }
}
