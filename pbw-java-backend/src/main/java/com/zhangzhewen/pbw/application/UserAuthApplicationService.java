package com.zhangzhewen.pbw.application;

import com.zhangzhewen.pbw.application.dto.user.UserAuthDto.UserLoginRequest;
import com.zhangzhewen.pbw.application.dto.user.UserAuthDto.UserLoginVO;
import com.zhangzhewen.pbw.application.dto.user.UserAuthDto.UserPasswordResetAcceptedVO;
import com.zhangzhewen.pbw.application.dto.user.UserAuthDto.UserPasswordResetConfirmRequest;
import com.zhangzhewen.pbw.application.dto.user.UserAuthDto.UserPasswordResetRequest;
import com.zhangzhewen.pbw.application.dto.user.UserAuthDto.UserProfileVO;
import com.zhangzhewen.pbw.application.dto.user.UserAuthDto.UserRegisterRequest;
import com.zhangzhewen.pbw.domain.gateway.CurrentActorGateway;
import com.zhangzhewen.pbw.domain.gateway.PasswordGateway;
import com.zhangzhewen.pbw.domain.gateway.PasswordResetNotificationGateway;
import com.zhangzhewen.pbw.domain.gateway.SessionGateway;
import com.zhangzhewen.pbw.domain.gateway.TokenGateway;
import com.zhangzhewen.pbw.domain.gateway.UserAccountGateway;
import com.zhangzhewen.pbw.domain.security.AccessToken;
import com.zhangzhewen.pbw.domain.shared.BusinessException;
import com.zhangzhewen.pbw.domain.shared.FieldViolation;
import com.zhangzhewen.pbw.domain.user.UserAccount;
import com.zhangzhewen.pbw.domain.user.UserAccount.UserRole;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.util.List;
import java.util.UUID;

@Service
public class UserAuthApplicationService {

    private final UserAccountGateway userGateway;
    private final TokenGateway tokenGateway;
    private final SessionGateway sessionGateway;
    private final PasswordGateway passwordGateway;
    private final PasswordResetNotificationGateway passwordResetNotificationGateway;
    private final CurrentActorGateway currentActorGateway;
    private final Duration resetTokenTtl;

    public UserAuthApplicationService(
            UserAccountGateway userGateway,
            TokenGateway tokenGateway,
            SessionGateway sessionGateway,
            PasswordGateway passwordGateway,
            PasswordResetNotificationGateway passwordResetNotificationGateway,
            CurrentActorGateway currentActorGateway,
            @org.springframework.beans.factory.annotation.Value("${pbw.security.reset-token-ttl}") Duration resetTokenTtl
    ) {
        this.userGateway = userGateway;
        this.tokenGateway = tokenGateway;
        this.sessionGateway = sessionGateway;
        this.passwordGateway = passwordGateway;
        this.passwordResetNotificationGateway = passwordResetNotificationGateway;
        this.currentActorGateway = currentActorGateway;
        this.resetTokenTtl = resetTokenTtl;
    }

    @Transactional(readOnly = true)
    public UserLoginVO login(UserLoginRequest request) {
        UserAccount user = userGateway.findByAccount(request.account())
                .filter(value -> value.role() == UserRole.USER)
                .filter(value -> value.passwordConfigured() && !value.base().deleted())
                .filter(value -> passwordGateway.matches(request.password(), value.password()))
                .orElseThrow(() -> BusinessException.unauthorized("账号或密码错误"));
        return issue(user);
    }

    @Transactional
    public UserLoginVO register(UserRegisterRequest request) {
        if (userGateway.accountExists(request.account(), null)) {
            throw new BusinessException("RESOURCE_CONFLICT", "账号已存在", List.of(new FieldViolation("account", "账号已存在")));
        }
        if (userGateway.emailExists(request.email(), null)) {
            throw new BusinessException("RESOURCE_CONFLICT", "邮箱已存在", List.of(new FieldViolation("email", "邮箱已存在")));
        }
        UserAccount user = userGateway.insert(new UserAccount(AdminApplicationSupport.newBase(), request.nickname(), request.account(), passwordGateway.encode(request.password()), true, request.email(), null, UserRole.USER));
        return issue(user);
    }

    @Transactional(readOnly = true)
    public UserProfileVO current() {
        Long userId = currentActorGateway.currentUserId()
                .orElseThrow(() -> BusinessException.unauthorized("当前会话无效"));
        UserAccount user = userGateway.findById(userId)
                .filter(value -> !value.base().deleted() && value.role() == UserRole.USER)
                .orElseThrow(() -> BusinessException.unauthorized("当前用户不存在或已停用"));
        return profile(user);
    }

    public void logout() {
        Long userId = currentActorGateway.currentUserId()
                .orElseThrow(() -> BusinessException.unauthorized("当前会话无效"));
        String tokenId = currentActorGateway.currentTokenId()
                .orElseThrow(() -> BusinessException.unauthorized("当前会话无效"));
        sessionGateway.revoke(tokenId, userId);
    }

    @Transactional(readOnly = true)
    public UserPasswordResetAcceptedVO requestPasswordReset(UserPasswordResetRequest request) {
        userGateway.findUserByAccountOrEmail(request.accountOrEmail()).ifPresent(user -> {
            String resetToken = "upr_" + UUID.randomUUID().toString().replace("-", "");
            sessionGateway.savePasswordResetToken(resetToken, user.base().id(), resetTokenTtl);
            if (user.email() != null) {
                passwordResetNotificationGateway.send(user.email(), user.nickname(), resetToken, resetTokenTtl);
            }
        });
        return new UserPasswordResetAcceptedVO("如果账号存在，密码重置邮件已发送");
    }

    @Transactional
    public void resetPassword(UserPasswordResetConfirmRequest request) {
        Long userId = sessionGateway.consumePasswordResetToken(request.resetToken())
                .orElseThrow(() -> new BusinessException("INVALID_RESET_TOKEN", "密码重置令牌无效或已过期"));
        UserAccount old = userGateway.findById(userId)
                .filter(value -> value.role() == UserRole.USER && !value.base().deleted())
                .orElseThrow(() -> new BusinessException("INVALID_RESET_TOKEN", "密码重置令牌无效或已过期"));
        userGateway.update(new UserAccount(old.base(), old.nickname(), old.account(), passwordGateway.encode(request.newPassword()), true, old.email(), old.avatar(), old.role()));
        sessionGateway.revokeAll(userId);
    }

    private UserLoginVO issue(UserAccount user) {
        AccessToken token = tokenGateway.issue(user);
        sessionGateway.save(user.base().id(), token);
        return new UserLoginVO(token.token(), token.expiresIn(), profile(user));
    }

    private static UserProfileVO profile(UserAccount user) {
        return new UserProfileVO(user.base().id(), user.nickname(), user.account(), user.email(), user.avatar(), user.role().displayName());
    }
}
