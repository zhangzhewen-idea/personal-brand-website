package com.zhangzhewen.pbw.application.dto.admin;

import com.zhangzhewen.pbw.application.dto.admin.AdminVideoDto.AdminVideoVO;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.List;

public final class AdminDashboardDto {

    private AdminDashboardDto() {
    }

    public record AdminDashboardVO(
            OffsetDateTime serverTime,
            String adminNickname,
            List<AdminMetricVO> metrics,
            AdminContentSummaryVO contentSummary,
            AdminCourseSummaryVO courseSummary,
            List<AdminVideoVO> latestVideos,
            AdminProfileSummaryVO profileSummary,
            AdminProfileCompletenessVO profileCompleteness
    ) {
        public AdminDashboardVO {
            metrics = List.copyOf(metrics);
            latestVideos = List.copyOf(latestVideos);
        }
    }

    public record AdminMetricVO(String key, long value, BigDecimal trendRate, String trendDirection, String caption) {
    }

    public record AdminContentSummaryVO(long videoCount, long materialCount, long matrixAccountCount, long userCount) {
    }

    public record AdminCourseSummaryVO(long onlineCount, long totalCount, BigDecimal onlineRate) {
    }

    public record AdminProfileSummaryVO(String authorIdentityTag, String slogan, String creationAttitude) {
    }

    public record AdminProfileCompletenessVO(
            int score,
            boolean brandBasicInfoComplete,
            boolean mediaResourcesComplete,
            int annualTop10FilmCount,
            int annualTop10FilmTarget
    ) {
    }
}
