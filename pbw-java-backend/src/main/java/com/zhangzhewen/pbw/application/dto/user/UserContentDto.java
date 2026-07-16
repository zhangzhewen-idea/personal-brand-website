package com.zhangzhewen.pbw.application.dto.user;

import java.math.BigDecimal;
import java.util.List;

public final class UserContentDto {

    private UserContentDto() {
    }

    public record UserBasicInfoVO(
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
            String contactInfo
    ) {
        public UserBasicInfoVO {
            annualTop10Films = List.copyOf(annualTop10Films);
            influentialThreeDirectors = List.copyOf(influentialThreeDirectors);
        }
    }

    public record UserVideoVO(Long id, String videoTitle, String videoIntro, String videoUrl, String videoCover) {
    }

    public record UserMaterialVO(
            Long id,
            String materialTitle,
            String materialPhoto,
            String materialIntro,
            BigDecimal price,
            int stock,
            List<UserSpecificationVO> specifications,
            String netdiskUrl
    ) {
        public UserMaterialVO {
            specifications = List.copyOf(specifications);
        }
    }

    public record UserSpecificationVO(String name, String value) {
    }

    public record UserMatrixAccountVO(Long id, String platformName, String platformLogo, String accountUrl, String intro) {
    }

    public record UserCourseVO(Long id, String courseName, String courseTag, String courseIntro, BigDecimal coursePrice) {
    }
}
