package com.zhangzhewen.pbw.application;

import com.zhangzhewen.pbw.application.AdminApplicationSupport.AuditRecorder;
import com.zhangzhewen.pbw.application.dto.admin.AdminCommonDto.AdminPageVO;
import com.zhangzhewen.pbw.application.dto.admin.AdminMatrixAccountDto.AdminMatrixAccountRequest;
import com.zhangzhewen.pbw.application.dto.admin.AdminMatrixAccountDto.AdminMatrixAccountVO;
import com.zhangzhewen.pbw.domain.content.MatrixAccount;
import com.zhangzhewen.pbw.domain.gateway.MatrixAccountGateway;
import com.zhangzhewen.pbw.domain.shared.BusinessException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;

@Service
public class AdminMatrixAccountApplicationService {

    private static final Set<String> SORT_FIELDS = Set.of("id", "platformName", "createTime", "updateTime");
    private final MatrixAccountGateway gateway;
    private final AuditRecorder audit;

    public AdminMatrixAccountApplicationService(MatrixAccountGateway gateway, AuditRecorder audit) {
        this.gateway = gateway;
        this.audit = audit;
    }

    @Transactional(readOnly = true)
    public AdminPageVO<AdminMatrixAccountVO> page(int page, int pageSize, String keyword, String status, String sortBy, String sortOrder) {
        return AdminApplicationSupport.pageVO(gateway.page(AdminApplicationSupport.criteria(page, pageSize, keyword, status, sortBy, sortOrder, SORT_FIELDS)), AdminMatrixAccountApplicationService::toVO);
    }

    @Transactional(readOnly = true)
    public AdminMatrixAccountVO detail(Long id) {
        return toVO(required(id));
    }

    @Transactional
    public AdminMatrixAccountVO create(AdminMatrixAccountRequest request) {
        MatrixAccount saved = gateway.insert(fromRequest(AdminApplicationSupport.newBase(), request));
        audit.success("CREATE", "matrix_account", saved.base().id());
        return toVO(saved);
    }

    @Transactional
    public AdminMatrixAccountVO update(Long id, AdminMatrixAccountRequest request) {
        MatrixAccount old = requiredActive(id);
        MatrixAccount requested = fromRequest(old.base(), request);
        MatrixAccount saved = gateway.update(new MatrixAccount(requested.base(), requested.platformName(), requested.platformLogo(), requested.accountUrl(), requested.intro(), old.followerCountText(), old.colorClass()));
        audit.success("UPDATE", "matrix_account", id);
        return toVO(saved);
    }

    @Transactional
    public AdminMatrixAccountVO copy(Long id) {
        MatrixAccount old = required(id);
        MatrixAccount saved = gateway.insert(new MatrixAccount(AdminApplicationSupport.newBase(), AdminApplicationSupport.copyName(old.platformName(), 255), old.platformLogo(), old.accountUrl(), old.intro(), old.followerCountText(), old.colorClass()));
        audit.success("COPY", "matrix_account", saved.base().id());
        return toVO(saved);
    }

    @Transactional
    public void delete(Long id) {
        required(id);
        gateway.setDeleted(id, true);
        audit.success("DELETE", "matrix_account", id);
    }

    @Transactional
    public AdminMatrixAccountVO restore(Long id) {
        required(id);
        gateway.setDeleted(id, false);
        audit.success("RESTORE", "matrix_account", id);
        return toVO(required(id));
    }

    private MatrixAccount required(Long id) {
        return gateway.findById(id).orElseThrow(() -> BusinessException.notFound("矩阵账号", id));
    }

    private MatrixAccount requiredActive(Long id) {
        MatrixAccount account = required(id);
        if (account.base().deleted()) {
            throw BusinessException.deleted("已删除矩阵账号不能编辑，请先恢复");
        }
        return account;
    }

    private static MatrixAccount fromRequest(com.zhangzhewen.pbw.domain.shared.BaseEntity base, AdminMatrixAccountRequest request) {
        return new MatrixAccount(base, request.platformName(), request.platformLogo(), request.accountUrl(), request.intro());
    }

    public static AdminMatrixAccountVO toVO(MatrixAccount account) {
        return new AdminMatrixAccountVO(account.base().id(), account.platformName(), account.platformLogo(), account.accountUrl(), account.intro(), account.base().createTime(), account.base().updateTime(), account.base().deleted());
    }
}
