package com.zhangzhewen.pbw.domain.shared;

import org.junit.jupiter.api.Test;

import java.util.ArrayList;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class PagingTest {

    @Test
    void pageDataCalculatesTotalPagesAndCopiesItems() {
        List<String> items = new ArrayList<>(List.of("first", "second"));
        PageData<String> page = PageData.of(items, 21, 2, 10);
        items.clear();

        assertThat(page.list()).containsExactly("first", "second");
        assertThat(page.totalPages()).isEqualTo(3);
        assertThatThrownBy(() -> page.list().add("third"))
                .isInstanceOf(UnsupportedOperationException.class);
    }

    @Test
    void pageCriteriaParsesSupportedValuesAndRejectsUnknownValues() {
        assertThat(PageCriteria.DeletionStatus.from("deleted")).isEqualTo(PageCriteria.DeletionStatus.DELETED);
        assertThat(PageCriteria.SortOrder.from("asc")).isEqualTo(PageCriteria.SortOrder.ASC);

        assertThatThrownBy(() -> PageCriteria.DeletionStatus.from("archived"))
                .isInstanceOfSatisfying(BusinessException.class, error -> {
                    assertThat(error.code()).isEqualTo("BAD_REQUEST");
                    assertThat(error.getMessage()).contains("status");
                });
        assertThatThrownBy(() -> PageCriteria.SortOrder.from("random"))
                .isInstanceOfSatisfying(BusinessException.class, error ->
                        assertThat(error.code()).isEqualTo("BAD_REQUEST"));
    }
}
