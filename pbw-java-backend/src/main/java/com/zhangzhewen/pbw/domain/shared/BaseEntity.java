package com.zhangzhewen.pbw.domain.shared;

import java.time.OffsetDateTime;

public record BaseEntity(Long id, OffsetDateTime createTime, OffsetDateTime updateTime, boolean deleted) {
}
