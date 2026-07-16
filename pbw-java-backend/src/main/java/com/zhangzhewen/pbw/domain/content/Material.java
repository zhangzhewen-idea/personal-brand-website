package com.zhangzhewen.pbw.domain.content;

import com.zhangzhewen.pbw.domain.shared.BaseEntity;

import java.math.BigDecimal;
import java.util.List;

public record Material(
        BaseEntity base,
        String materialTitle,
        String materialPhoto,
        String materialIntro,
        BigDecimal price,
        int stock,
        List<Specification> specifications,
        String netdiskUrl
) {
    public Material {
        specifications = List.copyOf(specifications);
    }

    public record Specification(String name, String value) {
    }
}
