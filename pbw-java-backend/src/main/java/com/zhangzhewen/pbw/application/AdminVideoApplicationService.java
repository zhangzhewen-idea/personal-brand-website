package com.zhangzhewen.pbw.application;

import com.zhangzhewen.pbw.application.AdminApplicationSupport.AuditRecorder;
import com.zhangzhewen.pbw.application.dto.admin.AdminCommonDto.AdminPageVO;
import com.zhangzhewen.pbw.application.dto.admin.AdminVideoDto.AdminVideoRequest;
import com.zhangzhewen.pbw.application.dto.admin.AdminVideoDto.AdminVideoVO;
import com.zhangzhewen.pbw.domain.content.Video;
import com.zhangzhewen.pbw.domain.gateway.VideoGateway;
import com.zhangzhewen.pbw.domain.shared.BusinessException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;

@Service
public class AdminVideoApplicationService {

    private static final Set<String> SORT_FIELDS = Set.of("id", "videoTitle", "createTime", "updateTime");
    private final VideoGateway gateway;
    private final AuditRecorder audit;

    public AdminVideoApplicationService(VideoGateway gateway, AuditRecorder audit) {
        this.gateway = gateway;
        this.audit = audit;
    }

    @Transactional(readOnly = true)
    public AdminPageVO<AdminVideoVO> page(int page, int pageSize, String keyword, String status, String sortBy, String sortOrder) {
        return AdminApplicationSupport.pageVO(
                gateway.page(AdminApplicationSupport.criteria(page, pageSize, keyword, status, sortBy, sortOrder, SORT_FIELDS)),
                AdminVideoApplicationService::toVO
        );
    }

    @Transactional(readOnly = true)
    public AdminVideoVO detail(Long id) {
        return toVO(required(id));
    }

    @Transactional
    public AdminVideoVO create(AdminVideoRequest request) {
        Video saved = gateway.insert(new Video(AdminApplicationSupport.newBase(), request.videoTitle(), request.videoIntro(), request.videoUrl(), request.videoCover()));
        audit.success("CREATE", "video", saved.base().id());
        return toVO(saved);
    }

    @Transactional
    public AdminVideoVO update(Long id, AdminVideoRequest request) {
        Video old = requiredActive(id);
        Video saved = gateway.update(new Video(old.base(), request.videoTitle(), request.videoIntro(), request.videoUrl(), request.videoCover()));
        audit.success("UPDATE", "video", id);
        return toVO(saved);
    }

    @Transactional
    public AdminVideoVO copy(Long id) {
        Video old = required(id);
        Video saved = gateway.insert(new Video(AdminApplicationSupport.newBase(), AdminApplicationSupport.copyName(old.videoTitle(), 255), old.videoIntro(), old.videoUrl(), old.videoCover()));
        audit.success("COPY", "video", saved.base().id());
        return toVO(saved);
    }

    @Transactional
    public void delete(Long id) {
        required(id);
        gateway.setDeleted(id, true);
        audit.success("DELETE", "video", id);
    }

    @Transactional
    public AdminVideoVO restore(Long id) {
        required(id);
        gateway.setDeleted(id, false);
        audit.success("RESTORE", "video", id);
        return toVO(required(id));
    }

    private Video required(Long id) {
        return gateway.findById(id).orElseThrow(() -> BusinessException.notFound("视频", id));
    }

    private Video requiredActive(Long id) {
        Video video = required(id);
        if (video.base().deleted()) {
            throw BusinessException.deleted("已删除视频不能编辑，请先恢复");
        }
        return video;
    }

    public static AdminVideoVO toVO(Video video) {
        return new AdminVideoVO(video.base().id(), video.videoTitle(), video.videoIntro(), video.videoUrl(), video.videoCover(), video.base().createTime(), video.base().updateTime(), video.base().deleted());
    }
}
