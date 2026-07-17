package com.zhangzhewen.pbw.application;

import com.zhangzhewen.pbw.application.AdminApplicationSupport.AuditRecorder;
import com.zhangzhewen.pbw.application.dto.admin.AdminCommonDto.AdminPageVO;
import com.zhangzhewen.pbw.application.dto.admin.AdminUserDto.AdminCreateUserRequest;
import com.zhangzhewen.pbw.application.dto.admin.AdminUserDto.AdminUpdateUserRequest;
import com.zhangzhewen.pbw.application.dto.admin.AdminUserDto.AdminUserVO;
import com.zhangzhewen.pbw.domain.gateway.CurrentActorGateway;
import com.zhangzhewen.pbw.domain.gateway.PasswordGateway;
import com.zhangzhewen.pbw.domain.gateway.SessionGateway;
import com.zhangzhewen.pbw.domain.gateway.UserAccountGateway;
import com.zhangzhewen.pbw.domain.shared.BusinessException;
import com.zhangzhewen.pbw.domain.shared.FieldViolation;
import com.zhangzhewen.pbw.domain.user.UserAccount;
import com.zhangzhewen.pbw.domain.user.UserAccount.UserRole;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;
import java.util.UUID;

@Service
public class AdminUserApplicationService {

    private static final Set<String> SORT_FIELDS = Set.of("id", "nickname", "account", "role", "createTime", "updateTime");
    private final UserAccountGateway gateway;
    private final SessionGateway sessionGateway;
    private final PasswordGateway passwordGateway;
    private final CurrentActorGateway currentActorGateway;
    private final AuditRecorder audit;

    public AdminUserApplicationService(UserAccountGateway gateway, SessionGateway sessionGateway, PasswordGateway passwordGateway, CurrentActorGateway currentActorGateway, AuditRecorder audit) {
        this.gateway = gateway;
        this.sessionGateway = sessionGateway;
        this.passwordGateway = passwordGateway;
        this.currentActorGateway = currentActorGateway;
        this.audit = audit;
    }

    @Transactional(readOnly = true)
    public AdminPageVO<AdminUserVO> page(int page, int pageSize, String keyword, String status, String sortBy, String sortOrder) {
        return AdminApplicationSupport.pageVO(gateway.page(AdminApplicationSupport.criteria(page, pageSize, keyword, status, sortBy, sortOrder, SORT_FIELDS)), AdminUserApplicationService::toVO);
    }

    @Transactional(readOnly = true)
    public AdminUserVO detail(Long id) {
        return toVO(required(id));
    }

    @Transactional
    public AdminUserVO create(AdminCreateUserRequest request) {
        ensureUnique(request.account(), request.email(), null);
        UserAccount saved = gateway.insert(new UserAccount(AdminApplicationSupport.newBase(), request.nickname(), request.account(), passwordGateway.encode(request.password()), true, request.email(), request.avatar(), UserRole.fromDisplayName(request.role())));
        audit.success("CREATE", "user", saved.base().id());
        return toVO(saved);
    }

    @Transactional
    public AdminUserVO update(Long id, AdminUpdateUserRequest request) {
        UserAccount old = requiredActive(id);
        UserRole newRole = UserRole.fromDisplayName(request.role());
        if (old.role() == UserRole.ADMIN && newRole != UserRole.ADMIN && gateway.countActiveAdmins() <= 1) {
            throw BusinessException.conflict("系统至少需要保留一个正常管理员");
        }
        ensureUnique(request.account(), request.email(), id);
        String password = request.password() == null ? old.password() : passwordGateway.encode(request.password());
        boolean configured = request.password() == null ? old.passwordConfigured() : true;
        UserAccount saved = gateway.update(new UserAccount(old.base(), request.nickname(), request.account(), password, configured, request.email(), request.avatar(), newRole));
        if (request.password() != null || newRole != old.role()) {
            sessionGateway.revokeAll(id);
        }
        audit.success("UPDATE", "user", id);
        return toVO(saved);
    }

    @Transactional
    public AdminUserVO copy(Long id) {
        UserAccount old = required(id);
        String placeholder = old.account() + "_copy_pending_" + UUID.randomUUID().toString().substring(0, 8);
        UserAccount inserted = gateway.insert(new UserAccount(AdminApplicationSupport.newBase(), AdminApplicationSupport.copyName(old.nickname(), 255), placeholder, null, false, null, old.avatar(), old.role()));
        String account = trimTo255(old.account(), "_copy_" + inserted.base().id());
        UserAccount saved = gateway.update(new UserAccount(inserted.base(), inserted.nickname(), account, null, false, null, inserted.avatar(), inserted.role()));
        audit.success("COPY", "user", saved.base().id());
        return toVO(saved);
    }

    @Transactional
    public void delete(Long id) {
        UserAccount user = required(id);
        if (currentActorGateway.currentUserId().filter(id::equals).isPresent()) {
            throw BusinessException.conflict("不能删除当前登录管理员");
        }
        if (!user.base().deleted() && user.role() == UserRole.ADMIN && gateway.countActiveAdmins() <= 1) {
            throw BusinessException.conflict("系统至少需要保留一个正常管理员");
        }
        gateway.setDeleted(id, true);
        sessionGateway.revokeAll(id);
        audit.success("DELETE", "user", id);
    }

    @Transactional
    public AdminUserVO restore(Long id) {
        required(id);
        gateway.setDeleted(id, false);
        audit.success("RESTORE", "user", id);
        return toVO(required(id));
    }

    private UserAccount required(Long id) {
        return gateway.findById(id).orElseThrow(() -> BusinessException.notFound("用户", id));
    }

    private UserAccount requiredActive(Long id) {
        UserAccount user = required(id);
        if (user.base().deleted()) {
            throw BusinessException.deleted("已删除用户不能编辑，请先恢复");
        }
        return user;
    }

    private void ensureUnique(String account, String email, Long excludingId) {
        if (gateway.accountExists(account, excludingId)) {
            throw new BusinessException("RESOURCE_CONFLICT", "账号已存在", List.of(new FieldViolation("account", "账号已存在")));
        }
        if (email != null && gateway.emailExists(email, excludingId)) {
            throw new BusinessException("RESOURCE_CONFLICT", "邮箱已存在", List.of(new FieldViolation("email", "邮箱已存在")));
        }
    }

    private static String trimTo255(String prefix, String suffix) {
        int allowed = 255 - suffix.length();
        return (prefix.length() > allowed ? prefix.substring(0, allowed) : prefix) + suffix;
    }

    public static AdminUserVO toVO(UserAccount user) {
        return new AdminUserVO(user.base().id(), user.nickname(), user.account(), user.email(), user.avatar(), user.role().displayName(), user.passwordConfigured(), user.base().createTime(), user.base().updateTime(), user.base().deleted());
    }
}
