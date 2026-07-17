package com.zhangzhewen.pbw.domain.content;

import com.zhangzhewen.pbw.domain.shared.BaseEntity;

import java.math.BigDecimal;
import java.util.List;

public record Course(
        BaseEntity base,
        String courseName,
        String courseTag,
        String courseIntro,
        BigDecimal coursePrice,
        boolean online,
        String duration,
        int lessonCount,
        List<String> features,
        String colorClass,
        String iconName,
        boolean userVisible
) {
    public Course {
        features = List.copyOf(features);
    }

    public Course(BaseEntity base, String courseName, String courseTag, String courseIntro, BigDecimal coursePrice, boolean online) {
        this(base, courseName, courseTag, courseIntro, coursePrice, online, null, 0, List.of(), "bg-blue-500", "Video", true);
    }
}
