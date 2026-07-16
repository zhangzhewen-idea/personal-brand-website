package com.zhangzhewen.pbw.application.dto.admin;

import com.zhangzhewen.pbw.application.dto.DtoSanitizer;
import jakarta.validation.Valid;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.List;

public final class AdminMaterialDto {

    private AdminMaterialDto() {
    }

    public record AdminMaterialRequest(
            @NotBlank @Size(max = 255) String materialTitle,
            @Size(max = 500) @Pattern(regexp = DtoSanitizer.WEB_URL_PATTERN) String materialPhoto,
            @Size(max = 5000) String materialIntro,
            @NotNull @DecimalMin("0.00") @DecimalMax("99999999.99") BigDecimal price,
            @PositiveOrZero @Max(2147483647) int stock,
            @NotNull @Size(max = 50) List<@Valid AdminSpecification> specifications,
            @Size(max = 1000) @Pattern(regexp = DtoSanitizer.WEB_URL_PATTERN) String netdiskUrl
    ) {
        public AdminMaterialRequest {
            materialTitle = DtoSanitizer.required(materialTitle);
            materialPhoto = DtoSanitizer.optional(materialPhoto);
            materialIntro = DtoSanitizer.optional(materialIntro);
            specifications = specifications == null ? null : List.copyOf(specifications);
            netdiskUrl = DtoSanitizer.optional(netdiskUrl);
        }
    }

    public record AdminSpecification(
            @NotBlank @Size(max = 100) String name,
            @NotBlank @Size(max = 255) String value
    ) {
        public AdminSpecification {
            name = DtoSanitizer.required(name);
            value = DtoSanitizer.required(value);
        }
    }

    public record AdminMaterialVO(
            Long id,
            String materialTitle,
            String materialPhoto,
            String materialIntro,
            BigDecimal price,
            int stock,
            List<AdminSpecification> specifications,
            String netdiskUrl,
            OffsetDateTime createTime,
            OffsetDateTime updateTime,
            boolean isDeleted
    ) {
        public AdminMaterialVO {
            specifications = List.copyOf(specifications);
        }
    }
}
