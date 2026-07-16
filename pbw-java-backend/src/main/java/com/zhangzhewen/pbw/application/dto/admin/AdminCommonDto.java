package com.zhangzhewen.pbw.application.dto.admin;

import jakarta.validation.constraints.AssertFalse;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public final class AdminCommonDto {

    private AdminCommonDto() {
    }

    public record AdminPageVO<T>(List<T> list, long total, int page, int pageSize, int totalPages) {
        public AdminPageVO {
            list = List.copyOf(list);
        }
    }

    public record AdminRestoreRequest(@NotNull @AssertFalse Boolean isDeleted) {
    }

    public record AdminFileVO(
            String fileKey,
            String url,
            String originalName,
            String contentType,
            long fileSize,
            String mediaType
    ) {
    }
}
