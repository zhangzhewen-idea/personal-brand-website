package com.zhangzhewen.pbw.infrastructure.file;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;

import java.io.ByteArrayInputStream;
import java.nio.file.Path;

import static org.assertj.core.api.Assertions.assertThat;

class LocalFileStorageGatewayImplTest {

    @TempDir
    Path uploadRoot;

    @Test
    void uploadedFileAlwaysUsesDomainRootRelativePath() {
        byte[] png = new byte[] {(byte) 0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a};
        LocalFileStorageGatewayImpl storage = new LocalFileStorageGatewayImpl(
                uploadRoot.toString(),
                "https://cdn.example.com/uploads/"
        );

        var stored = storage.store(
                "cover.png",
                "image/png",
                png.length,
                "image",
                new ByteArrayInputStream(png)
        );

        assertThat(stored.url()).startsWith("/uploads/images/");
        assertThat(stored.url()).doesNotContain("cdn.example.com");
    }
}
