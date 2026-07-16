package com.zhangzhewen.pbw.application;

import com.zhangzhewen.pbw.application.dto.user.UserAuthDto.UserLoginRequest;
import com.zhangzhewen.pbw.application.dto.user.UserAuthDto.UserLoginVO;
import com.zhangzhewen.pbw.application.dto.user.UserAuthDto.UserProfileVO;
import com.zhangzhewen.pbw.application.dto.user.UserAuthDto.UserRegisterRequest;
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

import java.util.List;

@Service
public class UserAuthApplicationService {

    private final UserAccountGateway userGateway;
    private final TokenGateway tokenGateway;
    private final SessionGateway sessionGateway;

    public UserAuthApplicationService(UserAccountGateway userGateway, TokenGateway tokenGateway, SessionGateway sessionGateway) {
        this.userGateway = userGateway;
        this.tokenGateway = tokenGateway;
        this.sessionGateway = sessionGateway;
    }

    @Transactional(readOnly = true)
    public UserLoginVO login(UserLoginRequest request) {
        UserAccount user = userGateway.findByAccount(request.account())
                .filter(value -> value.role() == UserRole.USER)
                .filter(value -> value.canLoginWith(request.password()))
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
        UserAccount user = userGateway.insert(new UserAccount(AdminApplicationSupport.newBase(), request.nickname(), request.account(), request.password(), true, request.email(), null, UserRole.USER));
        return issue(user);
    }

    private UserLoginVO issue(UserAccount user) {
        AccessToken token = tokenGateway.issue(user);
        sessionGateway.save(user.base().id(), token);
        return new UserLoginVO(token.token(), token.expiresIn(), new UserProfileVO(user.base().id(), user.nickname(), user.account(), user.email(), user.avatar(), user.role().displayName()));
    }
}
