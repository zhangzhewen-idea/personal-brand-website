package com.zhangzhewen.pbw.domain.file;

public record StoredFile(
        String fileKey,
        String url,
        String originalName,
        String contentType,
        long fileSize,
        String mediaType
) {
}
