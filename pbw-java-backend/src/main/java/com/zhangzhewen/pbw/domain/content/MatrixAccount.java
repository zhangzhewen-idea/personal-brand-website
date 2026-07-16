package com.zhangzhewen.pbw.domain.content;

import com.zhangzhewen.pbw.domain.shared.BaseEntity;

public record MatrixAccount(
        BaseEntity base,
        String platformName,
        String platformLogo,
        String accountUrl,
        String intro
) {
}
