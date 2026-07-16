package com.zhangzhewen.pbw.domain.shared;

import java.util.List;

public record PageData<T>(List<T> list, long total, int page, int pageSize, int totalPages) {

    public static <T> PageData<T> of(List<T> list, long total, int page, int pageSize) {
        int totalPages = total == 0 ? 0 : Math.toIntExact((total + pageSize - 1) / pageSize);
        return new PageData<>(List.copyOf(list), total, page, pageSize, totalPages);
    }
}
