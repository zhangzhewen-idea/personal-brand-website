package com.zhangzhewen.pbw.domain.content;

import com.zhangzhewen.pbw.domain.shared.BaseEntity;

import java.math.BigDecimal;

public record Course(
        BaseEntity base,
        String courseName,
        String courseTag,
        String courseIntro,
        BigDecimal coursePrice,
        boolean online
) {
}
