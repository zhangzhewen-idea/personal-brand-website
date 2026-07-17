package com.zhangzhewen.pbw.domain.content;

import com.zhangzhewen.pbw.domain.shared.BaseEntity;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class ContentModelTest {

    private static final BaseEntity BASE = new BaseEntity(1L, null, null, false);

    @Test
    void materialRecognizesFreePriceAndProtectsSpecifications() {
        List<Material.Specification> specifications = new ArrayList<>();
        specifications.add(new Material.Specification("格式", "MP4"));

        Material material = new Material(BASE, "转场素材", null, null, BigDecimal.ZERO, 10, specifications, "https://example.com/file");
        specifications.clear();

        assertThat(material.free()).isTrue();
        assertThat(material.specifications()).hasSize(1);
        assertThatThrownBy(() -> material.specifications().add(new Material.Specification("分辨率", "4K")))
                .isInstanceOf(UnsupportedOperationException.class);
    }

    @Test
    void courseCopiesFeaturesAndSuppliesUserFacingDefaults() {
        List<String> features = new ArrayList<>(List.of("案例实战"));
        Course course = new Course(BASE, "剪辑课", "进阶", "系统学习剪辑", new BigDecimal("199.00"), true,
                "8 小时", 12, features, "bg-purple-500", "Video", true);
        features.add("新增内容");

        assertThat(course.features()).containsExactly("案例实战");

        Course minimal = new Course(BASE, "入门课", null, null, BigDecimal.TEN, false);
        assertThat(minimal.features()).isEmpty();
        assertThat(minimal.userVisible()).isTrue();
        assertThat(minimal.colorClass()).isEqualTo("bg-blue-500");
    }
}
