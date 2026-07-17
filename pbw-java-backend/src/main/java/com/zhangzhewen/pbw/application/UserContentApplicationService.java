package com.zhangzhewen.pbw.application;

import com.zhangzhewen.pbw.application.dto.user.UserContentDto.UserBasicInfoVO;
import com.zhangzhewen.pbw.application.dto.user.UserContentDto.UserCourseVO;
import com.zhangzhewen.pbw.application.dto.user.UserContentDto.UserMaterialVO;
import com.zhangzhewen.pbw.application.dto.user.UserContentDto.UserMatrixAccountVO;
import com.zhangzhewen.pbw.application.dto.user.UserContentDto.UserVideoVO;
import com.zhangzhewen.pbw.domain.content.BasicInfo;
import com.zhangzhewen.pbw.domain.gateway.BasicInfoGateway;
import com.zhangzhewen.pbw.domain.gateway.CourseGateway;
import com.zhangzhewen.pbw.domain.gateway.MaterialGateway;
import com.zhangzhewen.pbw.domain.gateway.MatrixAccountGateway;
import com.zhangzhewen.pbw.domain.gateway.VideoGateway;
import com.zhangzhewen.pbw.domain.shared.BusinessException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class UserContentApplicationService {

    private final BasicInfoGateway basicInfoGateway;
    private final VideoGateway videoGateway;
    private final MaterialGateway materialGateway;
    private final MatrixAccountGateway matrixGateway;
    private final CourseGateway courseGateway;

    public UserContentApplicationService(BasicInfoGateway basicInfoGateway, VideoGateway videoGateway, MaterialGateway materialGateway, MatrixAccountGateway matrixGateway, CourseGateway courseGateway) {
        this.basicInfoGateway = basicInfoGateway;
        this.videoGateway = videoGateway;
        this.materialGateway = materialGateway;
        this.matrixGateway = matrixGateway;
        this.courseGateway = courseGateway;
    }

    @Transactional(readOnly = true)
    public UserBasicInfoVO basicInfo() {
        BasicInfo b = basicInfoGateway.findCurrent().orElseThrow(() -> BusinessException.notFound("基本信息", null));
        return new UserBasicInfoVO(b.base().id(), b.homeCoverVideo(), b.contactEmail(), b.contactQrCode(), b.totalPlayCount(), b.totalLikeCount(), b.totalFollowerCount(), b.authorIdentityTag(), b.slogan(), b.creationAttitude(), b.authorPhoto(), b.editingDeskWorkPhoto(), b.assetLibraryScreenshot(), b.dailyMovieWatchingPhoto(), b.annualTop10Films(), b.influentialThreeDirectors(), b.contactInfo());
    }

    @Transactional(readOnly = true)
    public List<UserVideoVO> videos(int limit) {
        return videoGateway.latestActive(limit).stream().map(v -> new UserVideoVO(v.base().id(), v.videoTitle(), v.videoIntro(), v.videoUrl(), v.videoCover(), v.platformName(), v.playCountText())).toList();
    }

    @Transactional(readOnly = true)
    public List<UserMaterialVO> materials(int limit) {
        return materialGateway.listActive(limit).stream().map(m -> new UserMaterialVO(m.base().id(), m.materialTitle(), m.materialPhoto(), m.materialIntro(), m.price(), m.itemCount(), m.free(), m.colorClass(), m.iconName(), m.free() ? m.netdiskUrl() : null)).toList();
    }

    @Transactional(readOnly = true)
    public List<UserMatrixAccountVO> matrixAccounts() {
        return matrixGateway.listActive().stream().map(m -> new UserMatrixAccountVO(m.base().id(), m.platformName(), m.platformLogo(), m.accountUrl(), m.intro(), m.followerCountText(), m.colorClass())).toList();
    }

    @Transactional(readOnly = true)
    public List<UserCourseVO> courses() {
        return courseGateway.listUserVisible().stream().map(c -> new UserCourseVO(c.base().id(), c.courseName(), c.courseTag(), c.courseIntro(), c.coursePrice(), c.online(), c.duration(), c.lessonCount(), c.features(), c.colorClass(), c.iconName())).toList();
    }
}
