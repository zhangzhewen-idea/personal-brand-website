package com.zhangzhewen.pbw.application;

import com.zhangzhewen.pbw.application.AdminApplicationSupport.AuditRecorder;
import com.zhangzhewen.pbw.application.dto.admin.AdminBasicInfoDto.AdminBasicInfoRequest;
import com.zhangzhewen.pbw.application.dto.admin.AdminBasicInfoDto.AdminBasicInfoVO;
import com.zhangzhewen.pbw.domain.content.BasicInfo;
import com.zhangzhewen.pbw.domain.gateway.BasicInfoGateway;
import com.zhangzhewen.pbw.domain.shared.BusinessException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AdminBasicInfoApplicationService {

    private final BasicInfoGateway gateway;
    private final AuditRecorder audit;

    public AdminBasicInfoApplicationService(BasicInfoGateway gateway, AuditRecorder audit) {
        this.gateway = gateway;
        this.audit = audit;
    }

    @Transactional(readOnly = true)
    public AdminBasicInfoVO current() {
        return toVO(gateway.findCurrent().orElseThrow(() -> BusinessException.notFound("基本信息", null)));
    }

    @Transactional
    public AdminBasicInfoVO create(AdminBasicInfoRequest request) {
        BasicInfo saved = gateway.insert(fromRequest(AdminApplicationSupport.newBase(), request));
        audit.success("CREATE", "basic_info", saved.base().id());
        return toVO(saved);
    }

    @Transactional
    public AdminBasicInfoVO update(Long id, AdminBasicInfoRequest request) {
        BasicInfo old = gateway.findById(id).orElseThrow(() -> BusinessException.notFound("基本信息", id));
        if (old.base().deleted()) {
            throw BusinessException.deleted("已删除基本信息不能编辑");
        }
        BasicInfo saved = gateway.update(fromRequest(old.base(), request));
        audit.success("UPDATE", "basic_info", id);
        return toVO(saved);
    }

    private static BasicInfo fromRequest(com.zhangzhewen.pbw.domain.shared.BaseEntity base, AdminBasicInfoRequest r) {
        return new BasicInfo(base, r.homeCoverVideo(), r.contactEmail(), r.contactQrCode(), r.totalPlayCount(), r.totalLikeCount(), r.totalFollowerCount(), r.authorIdentityTag(), r.slogan(), r.creationAttitude(), r.authorPhoto(), r.editingDeskWorkPhoto(), r.assetLibraryScreenshot(), r.dailyMovieWatchingPhoto(), r.annualTop10Films(), r.influentialThreeDirectors(), r.contactInfo());
    }

    public static AdminBasicInfoVO toVO(BasicInfo b) {
        return new AdminBasicInfoVO(b.base().id(), b.homeCoverVideo(), b.contactEmail(), b.contactQrCode(), b.totalPlayCount(), b.totalLikeCount(), b.totalFollowerCount(), b.authorIdentityTag(), b.slogan(), b.creationAttitude(), b.authorPhoto(), b.editingDeskWorkPhoto(), b.assetLibraryScreenshot(), b.dailyMovieWatchingPhoto(), b.annualTop10Films(), b.influentialThreeDirectors(), b.contactInfo(), b.base().createTime(), b.base().updateTime(), b.base().deleted());
    }
}
