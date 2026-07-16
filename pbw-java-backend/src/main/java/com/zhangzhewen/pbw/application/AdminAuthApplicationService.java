package com.zhangzhewen.pbw.application;

import com.zhangzhewen.pbw.application.dto.admin.AdminAuthDto.AdminLoginRequest;
import com.zhangzhewen.pbw.application.dto.admin.AdminAuthDto.AdminLoginVO;
import com.zhangzhewen.pbw.application.dto.admin.AdminAuthDto.AdminPasswordResetAcceptedVO;
import com.zhangzhewen.pbw.application.dto.admin.AdminAuthDto.AdminPasswordResetConfirmRequest;
import com.zhangzhewen.pbw.application.dto.admin.AdminAuthDto.AdminPasswordResetRequest;
import com.zhangzhewen.pbw.application.dto.admin.AdminAuthDto.AdminPasswordResetResultVO;
import com.zhangzhewen.pbw.application.dto.admin.AdminAuthDto.AdminSessionVO;
import com.zhangzhewen.pbw.domain.gateway.CurrentActorGateway;
import com.zhangzhewen.pbw.domain.gateway.SessionGateway;
import com.zhangzhewen.pbw.domain.gateway.TokenGateway;
import com.zhangzhewen.pbw.domain.gateway.UserAccountGateway;
import com.zhangzhewen.pbw.domain.security.AccessToken;
import com.zhangzhewen.pbw.domain.shared.BusinessException;
import com.zhangzhewen.pbw.domain.user.UserAccount;
import com.zhangzhewen.pbw.domain.user.UserAccount.UserRole;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.util.UUID;

@Service
public class AdminAuthApplicationService {

    private final UserAccountGateway userGateway;
    private final TokenGateway tokenGateway;
    private final SessionGateway sessionGateway;
    private final CurrentActorGateway currentActorGateway;
    private final Duration resetTokenTtl;

    public AdminAuthApplicationService(
            UserAccountGateway userGateway,
            TokenGateway tokenGateway,
            SessionGateway sessionGateway,
            CurrentActorGateway currentActorGateway,
            @Value("${pbw.security.reset-token-ttl}") Duration resetTokenTtl
    ) {
        this.userGateway = userGateway;
        this.tokenGateway = tokenGateway;
        this.sessionGateway = sessionGateway;
        this.currentActorGateway = currentActorGateway;
        this.resetTokenTtl = resetTokenTtl;
    }

    @Transactional(readOnly = true)
    public AdminLoginVO login(AdminLoginRequest request) {
        UserAccount user = userGateway.findByAccount(request.account())
                .filter(value -> value.role() == UserRole.ADMIN)
                .filter(value -> value.canLoginWith(request.password()))
                .orElseThrow(() -> BusinessException.unauthorized("账号或密码错误"));
        AccessToken token = tokenGateway.issue(user);
        sessionGateway.save(user.base().id(), token);
        return new AdminLoginVO(token.token(), token.expiresIn(), user.nickname(), user.role().displayName());
    }

    @Transactional(readOnly = true)
    public AdminSessionVO current() {
        Long id = currentActorGateway.currentUserId().orElseThrow(() -> BusinessException.unauthorized("当前会话无效"));
        UserAccount user = userGateway.findById(id)
                .filter(value -> !value.base().deleted() && value.role() == UserRole.ADMIN)
                .orElseThrow(() -> BusinessException.unauthorized("当前管理员不存在或已停用"));
        return new AdminSessionVO(user.base().id(), user.nickname(), user.account(), user.email(), user.avatar(), user.role().displayName());
    }

    public void logout() {
        Long userId = currentActorGateway.currentUserId().orElseThrow(() -> BusinessException.unauthorized("当前会话无效"));
        String tokenId = currentActorGateway.currentTokenId().orElseThrow(() -> BusinessException.unauthorized("当前会话无效"));
        sessionGateway.revoke(tokenId, userId);
    }

    @Transactional(readOnly = true)
    public AdminPasswordResetAcceptedVO requestPasswordReset(AdminPasswordResetRequest request) {
        userGateway.findAdminByAccountOrEmail(request.accountOrEmail()).ifPresent(user -> {
            String resetToken = "prt_" + UUID.randomUUID().toString().replace("-", "");
            sessionGateway.savePasswordResetToken(resetToken, user.base().id(), resetTokenTtl);
        });
        return new AdminPasswordResetAcceptedVO(true, resetTokenTtl.toSeconds());
    }

    @Transactional
    public AdminPasswordResetResultVO resetPassword(AdminPasswordResetConfirmRequest request) {
        Long userId = sessionGateway.consumePasswordResetToken(request.resetToken())
                .orElseThrow(() -> BusinessException.unauthorized("密码重置令牌无效或已过期"));
        UserAccount old = userGateway.findById(userId).orElseThrow(() -> BusinessException.notFound("管理员", userId));
        userGateway.update(new UserAccount(old.base(), old.nickname(), old.account(), request.newPassword(), true, old.email(), old.avatar(), old.role()));
        sessionGateway.revokeAll(userId);
        return new AdminPasswordResetResultVO(true);
    }
}
