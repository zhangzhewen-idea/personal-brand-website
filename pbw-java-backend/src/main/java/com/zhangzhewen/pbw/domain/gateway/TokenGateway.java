package com.zhangzhewen.pbw.domain.gateway;

import com.zhangzhewen.pbw.domain.security.AccessToken;
import com.zhangzhewen.pbw.domain.security.TokenClaims;
import com.zhangzhewen.pbw.domain.user.UserAccount;

public interface TokenGateway {
    AccessToken issue(UserAccount userAccount);

    TokenClaims parse(String token);
}
