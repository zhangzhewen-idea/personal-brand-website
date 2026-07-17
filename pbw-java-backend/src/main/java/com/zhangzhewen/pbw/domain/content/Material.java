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
        String netdiskUrl,
        int itemCount,
        String colorClass,
        String iconName
) {
    public Material {
        specifications = List.copyOf(specifications);
    }

    public Material(BaseEntity base, String materialTitle, String materialPhoto, String materialIntro, BigDecimal price, int stock, List<Specification> specifications, String netdiskUrl) {
        this(base, materialTitle, materialPhoto, materialIntro, price, stock, specifications, netdiskUrl, stock, "bg-blue-500", "Scissors");
    }

    public boolean free() {
        return price.signum() == 0;
    }

    public record Specification(String name, String value) {
    }
}
