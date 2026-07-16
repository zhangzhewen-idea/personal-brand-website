package com.zhangzhewen.pbw.infrastructure.persistence.gateway;

import tools.jackson.core.JacksonException;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;
import com.zhangzhewen.pbw.domain.shared.BaseEntity;
import com.zhangzhewen.pbw.infrastructure.persistence.data.BasePO;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.List;

final class PersistenceSupport {

    private static final ZoneId ZONE_ID = ZoneId.of("Asia/Shanghai");

    private PersistenceSupport() {
    }

    static BaseEntity toBase(BasePO po) {
        return new BaseEntity(
                po.getId(),
                po.getCreateTime() == null ? null : po.getCreateTime().atZone(ZONE_ID).toOffsetDateTime(),
                po.getUpdateTime() == null ? null : po.getUpdateTime().atZone(ZONE_ID).toOffsetDateTime(),
                Boolean.TRUE.equals(po.getIsDeleted())
        );
    }

    static void copyBase(BaseEntity base, BasePO po) {
        po.setId(base.id());
        po.setCreateTime(toLocal(base.createTime()));
        po.setUpdateTime(toLocal(base.updateTime()));
        po.setIsDeleted(base.deleted());
    }

    private static LocalDateTime toLocal(java.time.OffsetDateTime time) {
        return time == null ? null : time.atZoneSameInstant(ZONE_ID).toLocalDateTime();
    }

    static String writeJson(ObjectMapper objectMapper, Object value) {
        try {
            return objectMapper.writeValueAsString(value);
        } catch (JacksonException exception) {
            throw new IllegalStateException("JSON 序列化失败", exception);
        }
    }

    static <T> List<T> readList(ObjectMapper objectMapper, String json, TypeReference<List<T>> type) {
        try {
            return objectMapper.readValue(json, type);
        } catch (JacksonException exception) {
            throw new IllegalStateException("数据库 JSON 字段解析失败", exception);
        }
    }
}
