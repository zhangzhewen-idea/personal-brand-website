package com.zhangzhewen.pbw.domain.gateway;

public interface PasswordGateway {
    String encode(String rawPassword);

    boolean matches(String rawPassword, String encodedPassword);
}
