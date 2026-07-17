package com.zhangzhewen.pbw.infrastructure.file;

import com.zhangzhewen.pbw.domain.file.StoredFile;
import com.zhangzhewen.pbw.domain.gateway.FileStorageGateway;
import com.zhangzhewen.pbw.domain.shared.BusinessException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.io.BufferedInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.URI;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.time.LocalDate;
import java.util.Arrays;
import java.util.Locale;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

@Component
public class LocalFileStorageGatewayImpl implements FileStorageGateway {

    private static final long IMAGE_LIMIT = 10L * 1024 * 1024;
    private static final long VIDEO_LIMIT = 100L * 1024 * 1024;
    private static final Map<String, Set<String>> EXTENSIONS = Map.of(
            "image/jpeg", Set.of("jpg", "jpeg"),
            "image/png", Set.of("png"),
            "image/webp", Set.of("webp"),
            "video/mp4", Set.of("mp4"),
            "video/webm", Set.of("webm"),
            "video/quicktime", Set.of("mov")
    );

    private final Path root;
    private final String publicBasePath;

    public LocalFileStorageGatewayImpl(@Value("${pbw.storage.root}") String root, @Value("${pbw.storage.public-base-url}") String publicBaseUrl) {
        this.root = Path.of(root).toAbsolutePath().normalize();
        this.publicBasePath = toRootRelativePath(publicBaseUrl);
    }

    @Override
    public StoredFile store(String originalName, String declaredContentType, long size, String mediaType, InputStream content) {
        validateBasic(originalName, size, mediaType);
        String extension = extension(originalName);
        try {
            BufferedInputStream buffered = new BufferedInputStream(content);
            buffered.mark(32);
            byte[] header = buffered.readNBytes(16);
            buffered.reset();
            String detectedContentType = detect(header, extension);
            if (!EXTENSIONS.getOrDefault(detectedContentType, Set.of()).contains(extension)) {
                throw unsupported();
            }
            if (declaredContentType != null && !declaredContentType.equalsIgnoreCase(detectedContentType)) {
                throw unsupported();
            }
            if ("image".equals(mediaType) != detectedContentType.startsWith("image/")) {
                throw unsupported();
            }
            LocalDate today = LocalDate.now();
            String key = mediaType + "s/" + today.getYear() + "/" + String.format("%02d", today.getMonthValue()) + "/" + UUID.randomUUID().toString().replace("-", "") + "." + extension;
            Path destination = root.resolve(key).normalize();
            if (!destination.startsWith(root)) {
                throw BusinessException.badRequest("非法文件路径");
            }
            Files.createDirectories(destination.getParent());
            Path temporary = Files.createTempFile(destination.getParent(), ".upload-", ".tmp");
            try {
                Files.copy(buffered, temporary, StandardCopyOption.REPLACE_EXISTING);
                Files.move(temporary, destination, StandardCopyOption.ATOMIC_MOVE, StandardCopyOption.REPLACE_EXISTING);
            } finally {
                Files.deleteIfExists(temporary);
            }
            return new StoredFile(key, publicBasePath + "/" + key, originalName, detectedContentType, size, mediaType);
        } catch (IOException exception) {
            throw new IllegalStateException("文件保存失败", exception);
        }
    }

    private static String toRootRelativePath(String value) {
        String normalized = value == null ? "" : value.trim();
        if (normalized.startsWith("http://") || normalized.startsWith("https://")) {
            normalized = URI.create(normalized).getPath();
        }
        if (!normalized.startsWith("/")) {
            normalized = "/" + normalized;
        }
        normalized = normalized.replaceAll("/+$", "");
        return normalized.isEmpty() ? "/uploads" : normalized;
    }

    private static void validateBasic(String name, long size, String mediaType) {
        if (name == null || name.isBlank() || (!"image".equals(mediaType) && !"video".equals(mediaType))) {
            throw BusinessException.badRequest("file 和 mediaType 必填，mediaType 仅允许 image、video");
        }
        long limit = "image".equals(mediaType) ? IMAGE_LIMIT : VIDEO_LIMIT;
        if (size <= 0 || size > limit) {
            throw new BusinessException("FILE_TOO_LARGE", "文件大小超过限制");
        }
    }

    private static String extension(String name) {
        int index = name.lastIndexOf('.');
        if (index < 1 || index == name.length() - 1) throw unsupported();
        return name.substring(index + 1).toLowerCase(Locale.ROOT);
    }

    private static String detect(byte[] h, String extension) {
        if (startsWith(h, 0xFF, 0xD8, 0xFF)) return "image/jpeg";
        if (startsWith(h, 0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A)) return "image/png";
        if (ascii(h, 0, "RIFF") && ascii(h, 8, "WEBP")) return "image/webp";
        if (startsWith(h, 0x1A, 0x45, 0xDF, 0xA3)) return "video/webm";
        if (ascii(h, 4, "ftyp")) return "mov".equals(extension) ? "video/quicktime" : "video/mp4";
        throw unsupported();
    }

    private static boolean startsWith(byte[] data, int... expected) {
        if (data.length < expected.length) return false;
        for (int i = 0; i < expected.length; i++) if ((data[i] & 0xFF) != expected[i]) return false;
        return true;
    }

    private static boolean ascii(byte[] data, int offset, String expected) {
        byte[] bytes = expected.getBytes(java.nio.charset.StandardCharsets.US_ASCII);
        return data.length >= offset + bytes.length && Arrays.equals(Arrays.copyOfRange(data, offset, offset + bytes.length), bytes);
    }

    private static BusinessException unsupported() {
        return new BusinessException("UNSUPPORTED_MEDIA_TYPE", "文件扩展名、MIME 或文件特征不受支持");
    }
}
