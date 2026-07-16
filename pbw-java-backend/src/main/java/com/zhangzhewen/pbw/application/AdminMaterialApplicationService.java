package com.zhangzhewen.pbw.application;

import com.zhangzhewen.pbw.application.AdminApplicationSupport.AuditRecorder;
import com.zhangzhewen.pbw.application.dto.admin.AdminCommonDto.AdminPageVO;
import com.zhangzhewen.pbw.application.dto.admin.AdminMaterialDto.AdminMaterialRequest;
import com.zhangzhewen.pbw.application.dto.admin.AdminMaterialDto.AdminMaterialVO;
import com.zhangzhewen.pbw.application.dto.admin.AdminMaterialDto.AdminSpecification;
import com.zhangzhewen.pbw.domain.content.Material;
import com.zhangzhewen.pbw.domain.gateway.MaterialGateway;
import com.zhangzhewen.pbw.domain.shared.BusinessException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;

@Service
public class AdminMaterialApplicationService {

    private static final Set<String> SORT_FIELDS = Set.of("id", "materialTitle", "price", "stock", "createTime", "updateTime");
    private final MaterialGateway gateway;
    private final AuditRecorder audit;

    public AdminMaterialApplicationService(MaterialGateway gateway, AuditRecorder audit) {
        this.gateway = gateway;
        this.audit = audit;
    }

    @Transactional(readOnly = true)
    public AdminPageVO<AdminMaterialVO> page(int page, int pageSize, String keyword, String status, String sortBy, String sortOrder) {
        return AdminApplicationSupport.pageVO(gateway.page(AdminApplicationSupport.criteria(page, pageSize, keyword, status, sortBy, sortOrder, SORT_FIELDS)), AdminMaterialApplicationService::toVO);
    }

    @Transactional(readOnly = true)
    public AdminMaterialVO detail(Long id) {
        return toVO(required(id));
    }

    @Transactional
    public AdminMaterialVO create(AdminMaterialRequest request) {
        Material saved = gateway.insert(fromRequest(AdminApplicationSupport.newBase(), request));
        audit.success("CREATE", "material", saved.base().id());
        return toVO(saved);
    }

    @Transactional
    public AdminMaterialVO update(Long id, AdminMaterialRequest request) {
        Material old = requiredActive(id);
        Material saved = gateway.update(fromRequest(old.base(), request));
        audit.success("UPDATE", "material", id);
        return toVO(saved);
    }

    @Transactional
    public AdminMaterialVO copy(Long id) {
        Material old = required(id);
        Material saved = gateway.insert(new Material(AdminApplicationSupport.newBase(), AdminApplicationSupport.copyName(old.materialTitle(), 255), old.materialPhoto(), old.materialIntro(), old.price(), old.stock(), old.specifications(), old.netdiskUrl()));
        audit.success("COPY", "material", saved.base().id());
        return toVO(saved);
    }

    @Transactional
    public void delete(Long id) {
        required(id);
        gateway.setDeleted(id, true);
        audit.success("DELETE", "material", id);
    }

    @Transactional
    public AdminMaterialVO restore(Long id) {
        required(id);
        gateway.setDeleted(id, false);
        audit.success("RESTORE", "material", id);
        return toVO(required(id));
    }

    private Material required(Long id) {
        return gateway.findById(id).orElseThrow(() -> BusinessException.notFound("素材", id));
    }

    private Material requiredActive(Long id) {
        Material material = required(id);
        if (material.base().deleted()) {
            throw BusinessException.deleted("已删除素材不能编辑，请先恢复");
        }
        return material;
    }

    private static Material fromRequest(com.zhangzhewen.pbw.domain.shared.BaseEntity base, AdminMaterialRequest request) {
        return new Material(base, request.materialTitle(), request.materialPhoto(), request.materialIntro(), request.price(), request.stock(), request.specifications().stream().map(s -> new Material.Specification(s.name(), s.value())).toList(), request.netdiskUrl());
    }

    public static AdminMaterialVO toVO(Material material) {
        return new AdminMaterialVO(material.base().id(), material.materialTitle(), material.materialPhoto(), material.materialIntro(), material.price(), material.stock(), material.specifications().stream().map(s -> new AdminSpecification(s.name(), s.value())).toList(), material.netdiskUrl(), material.base().createTime(), material.base().updateTime(), material.base().deleted());
    }
}
