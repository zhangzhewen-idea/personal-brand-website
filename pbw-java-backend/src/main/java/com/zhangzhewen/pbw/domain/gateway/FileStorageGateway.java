package com.zhangzhewen.pbw.domain.gateway;

import com.zhangzhewen.pbw.domain.file.StoredFile;

import java.io.InputStream;

public interface FileStorageGateway {
    StoredFile store(String originalName, String declaredContentType, long size, String mediaType, InputStream content);
}
