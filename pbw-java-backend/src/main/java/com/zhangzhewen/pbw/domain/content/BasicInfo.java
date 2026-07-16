package com.zhangzhewen.pbw.domain.content;

import com.zhangzhewen.pbw.domain.shared.BaseEntity;

import java.util.List;

public record BasicInfo(
        BaseEntity base,
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
    public BasicInfo {
        annualTop10Films = List.copyOf(annualTop10Films);
        influentialThreeDirectors = List.copyOf(influentialThreeDirectors);
    }
}
