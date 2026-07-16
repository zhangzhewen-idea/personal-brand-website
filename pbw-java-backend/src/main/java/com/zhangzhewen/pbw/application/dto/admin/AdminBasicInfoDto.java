package com.zhangzhewen.pbw.application.dto.admin;

import com.zhangzhewen.pbw.application.dto.DtoSanitizer;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;

import java.time.OffsetDateTime;
import java.util.List;

public final class AdminBasicInfoDto {

    private AdminBasicInfoDto() {
    }

    public record AdminBasicInfoRequest(
            @NotBlank @Size(max = 500) @Pattern(regexp = DtoSanitizer.WEB_URL_PATTERN) String homeCoverVideo,
            @Email @Size(max = 255) String contactEmail,
            @Size(max = 500) @Pattern(regexp = DtoSanitizer.WEB_URL_PATTERN) String contactQrCode,
            @PositiveOrZero long totalPlayCount,
            @PositiveOrZero long totalLikeCount,
            @PositiveOrZero long totalFollowerCount,
            @NotBlank @Size(max = 255) String authorIdentityTag,
            @NotBlank @Size(max = 255) String slogan,
            @Size(max = 5000) String creationAttitude,
            @Size(max = 500) @Pattern(regexp = DtoSanitizer.WEB_URL_PATTERN) String authorPhoto,
            @Size(max = 500) @Pattern(regexp = DtoSanitizer.WEB_URL_PATTERN) String editingDeskWorkPhoto,
            @Size(max = 500) @Pattern(regexp = DtoSanitizer.WEB_URL_PATTERN) String assetLibraryScreenshot,
            @Size(max = 500) @Pattern(regexp = DtoSanitizer.WEB_URL_PATTERN) String dailyMovieWatchingPhoto,
            @NotNull @Size(max = 10) List<@NotBlank @Size(max = 255) String> annualTop10Films,
            @NotNull @Size(max = 3) List<@NotBlank @Size(max = 255) String> influentialThreeDirectors,
            @Size(max = 500) String contactInfo
    ) {
        public AdminBasicInfoRequest {
            homeCoverVideo = DtoSanitizer.required(homeCoverVideo);
            contactEmail = DtoSanitizer.optional(contactEmail);
            contactQrCode = DtoSanitizer.optional(contactQrCode);
            authorIdentityTag = DtoSanitizer.required(authorIdentityTag);
            slogan = DtoSanitizer.required(slogan);
            creationAttitude = DtoSanitizer.optional(creationAttitude);
            authorPhoto = DtoSanitizer.optional(authorPhoto);
            editingDeskWorkPhoto = DtoSanitizer.optional(editingDeskWorkPhoto);
            assetLibraryScreenshot = DtoSanitizer.optional(assetLibraryScreenshot);
            dailyMovieWatchingPhoto = DtoSanitizer.optional(dailyMovieWatchingPhoto);
            annualTop10Films = normalize(annualTop10Films);
            influentialThreeDirectors = normalize(influentialThreeDirectors);
            contactInfo = DtoSanitizer.optional(contactInfo);
        }

        private static List<String> normalize(List<String> values) {
            return values == null ? null : values.stream().map(DtoSanitizer::required).toList();
        }
    }

    public record AdminBasicInfoVO(
            Long id,
            String homeCoverVideo,
            String contactEmail,
            String contactQrCode,
            long totalPlayCount,
            long totalLikeCount,
            long totalFollowerCount,
            String authorIdentityTag,
            String slogan,
            String creationAttitude,
            String authorPhoto,
            String editingDeskWorkPhoto,
            String assetLibraryScreenshot,
            String dailyMovieWatchingPhoto,
            List<String> annualTop10Films,
            List<String> influentialThreeDirectors,
            String contactInfo,
            OffsetDateTime createTime,
            OffsetDateTime updateTime,
            boolean isDeleted
    ) {
        public AdminBasicInfoVO {
            annualTop10Films = List.copyOf(annualTop10Films);
            influentialThreeDirectors = List.copyOf(influentialThreeDirectors);
        }
    }
}
