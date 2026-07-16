package com.zhangzhewen.pbw.application;

import com.zhangzhewen.pbw.application.dto.admin.AdminDashboardDto.AdminContentSummaryVO;
import com.zhangzhewen.pbw.application.dto.admin.AdminDashboardDto.AdminCourseSummaryVO;
import com.zhangzhewen.pbw.application.dto.admin.AdminDashboardDto.AdminDashboardVO;
import com.zhangzhewen.pbw.application.dto.admin.AdminDashboardDto.AdminMetricVO;
import com.zhangzhewen.pbw.application.dto.admin.AdminDashboardDto.AdminProfileCompletenessVO;
import com.zhangzhewen.pbw.application.dto.admin.AdminDashboardDto.AdminProfileSummaryVO;
import com.zhangzhewen.pbw.domain.content.BasicInfo;
import com.zhangzhewen.pbw.domain.gateway.BasicInfoGateway;
import com.zhangzhewen.pbw.domain.gateway.CourseGateway;
import com.zhangzhewen.pbw.domain.gateway.CurrentActorGateway;
import com.zhangzhewen.pbw.domain.gateway.MaterialGateway;
import com.zhangzhewen.pbw.domain.gateway.MatrixAccountGateway;
import com.zhangzhewen.pbw.domain.gateway.UserAccountGateway;
import com.zhangzhewen.pbw.domain.gateway.VideoGateway;
import com.zhangzhewen.pbw.domain.shared.BusinessException;
import com.zhangzhewen.pbw.domain.user.UserAccount;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class AdminDashboardApplicationService {

    private final BasicInfoGateway basicInfoGateway;
    private final VideoGateway videoGateway;
    private final MaterialGateway materialGateway;
    private final MatrixAccountGateway matrixGateway;
    private final CourseGateway courseGateway;
    private final UserAccountGateway userGateway;
    private final CurrentActorGateway currentActorGateway;

    public AdminDashboardApplicationService(BasicInfoGateway basicInfoGateway, VideoGateway videoGateway, MaterialGateway materialGateway, MatrixAccountGateway matrixGateway, CourseGateway courseGateway, UserAccountGateway userGateway, CurrentActorGateway currentActorGateway) {
        this.basicInfoGateway = basicInfoGateway;
        this.videoGateway = videoGateway;
        this.materialGateway = materialGateway;
        this.matrixGateway = matrixGateway;
        this.courseGateway = courseGateway;
        this.userGateway = userGateway;
        this.currentActorGateway = currentActorGateway;
    }

    @Transactional(readOnly = true)
    public AdminDashboardVO dashboard(int trendDays, int latestVideoLimit) {
        if (trendDays != 7 && trendDays != 30 && trendDays != 90) {
            throw BusinessException.badRequest("trendDays 仅允许 7、30、90");
        }
        if (latestVideoLimit < 1 || latestVideoLimit > 10) {
            throw BusinessException.badRequest("latestVideoLimit 必须在 1-10 之间");
        }
        UserAccount admin = userGateway.findById(currentActorGateway.currentUserId().orElseThrow(() -> BusinessException.unauthorized("当前会话无效")))
                .orElseThrow(() -> BusinessException.unauthorized("当前管理员不存在"));
        BasicInfo basic = basicInfoGateway.findCurrent().orElse(null);
        long onlineCourses = courseGateway.countOnlineActive();
        long allCourses = courseGateway.countActive();
        List<AdminMetricVO> metrics = new ArrayList<>();
        metrics.add(metric("totalPlayCount", basic == null ? 0 : basic.totalPlayCount(), "内容持续被看见"));
        metrics.add(metric("totalLikeCount", basic == null ? 0 : basic.totalLikeCount(), "互动表现稳定"));
        metrics.add(metric("totalFollowerCount", basic == null ? 0 : basic.totalFollowerCount(), "账号矩阵共计"));
        metrics.add(metric("onlineCourseCount", onlineCourses, "共 " + allCourses + " 门课程"));
        AdminProfileSummaryVO profileSummary = basic == null ? null : new AdminProfileSummaryVO(basic.authorIdentityTag(), basic.slogan(), basic.creationAttitude());
        return new AdminDashboardVO(
                ZonedDateTime.now(ZoneId.of("Asia/Shanghai")).toOffsetDateTime(),
                admin.nickname(),
                metrics,
                new AdminContentSummaryVO(videoGateway.countActive(), materialGateway.countActive(), matrixGateway.countActive(), userGateway.countActive()),
                new AdminCourseSummaryVO(onlineCourses, allCourses, percentage(onlineCourses, allCourses)),
                videoGateway.latestActive(latestVideoLimit).stream().map(AdminVideoApplicationService::toVO).toList(),
                profileSummary,
                completeness(basic)
        );
    }

    private static AdminMetricVO metric(String key, long value, String caption) {
        return new AdminMetricVO(key, value, null, "flat", caption);
    }

    private static BigDecimal percentage(long part, long total) {
        return total == 0 ? BigDecimal.ZERO : BigDecimal.valueOf(part).multiply(BigDecimal.valueOf(100)).divide(BigDecimal.valueOf(total), 2, RoundingMode.HALF_UP);
    }

    private static AdminProfileCompletenessVO completeness(BasicInfo basic) {
        if (basic == null) {
            return new AdminProfileCompletenessVO(0, false, false, 0, 10);
        }
        long filledCore = java.util.stream.Stream.of(basic.homeCoverVideo(), basic.authorIdentityTag(), basic.slogan())
                .filter(AdminDashboardApplicationService::present).count();
        int optionalFilled = 0;
        optionalFilled += present(basic.contactEmail()) ? 1 : 0;
        optionalFilled += present(basic.contactQrCode()) ? 1 : 0;
        optionalFilled += present(basic.creationAttitude()) ? 1 : 0;
        optionalFilled += present(basic.authorPhoto()) ? 1 : 0;
        optionalFilled += present(basic.editingDeskWorkPhoto()) ? 1 : 0;
        optionalFilled += present(basic.assetLibraryScreenshot()) ? 1 : 0;
        optionalFilled += present(basic.dailyMovieWatchingPhoto()) ? 1 : 0;
        optionalFilled += present(basic.contactInfo()) ? 1 : 0;
        optionalFilled += basic.annualTop10Films().isEmpty() ? 0 : 1;
        optionalFilled += basic.influentialThreeDirectors().isEmpty() ? 0 : 1;
        int score = (int) Math.round((filledCore + optionalFilled) * 100.0 / 13.0);
        boolean mediaComplete = present(basic.homeCoverVideo()) && present(basic.authorPhoto()) && present(basic.contactQrCode());
        return new AdminProfileCompletenessVO(score, filledCore == 3, mediaComplete, basic.annualTop10Films().size(), 10);
    }

    private static boolean present(String value) {
        return value != null && !value.isBlank();
    }
}
