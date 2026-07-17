package com.zhangzhewen.pbw.domain.gateway;

import java.time.Duration;

public interface PasswordResetNotificationGateway {
    void send(String email, String nickname, String resetToken, Duration validFor);
}
