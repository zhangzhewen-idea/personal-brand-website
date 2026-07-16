package com.zhangzhewen.pbw.application;

import com.zhangzhewen.pbw.application.dto.admin.AdminCommonDto.AdminFileVO;
import com.zhangzhewen.pbw.domain.file.StoredFile;
import com.zhangzhewen.pbw.domain.gateway.FileStorageGateway;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.InputStream;

@Service
public class AdminFileApplicationService {

    private final FileStorageGateway fileStorageGateway;

    public AdminFileApplicationService(FileStorageGateway fileStorageGateway) {
        this.fileStorageGateway = fileStorageGateway;
    }

    public AdminFileVO upload(String originalName, String contentType, long size, String mediaType, InputStream content) throws IOException {
        try (content) {
            StoredFile file = fileStorageGateway.store(originalName, contentType, size, mediaType, content);
            return new AdminFileVO(file.fileKey(), file.url(), file.originalName(), file.contentType(), file.fileSize(), file.mediaType());
        }
    }
}
