package com.zhangzhewen.pbw.domain.gateway;

public interface AuditGateway {
    void record(Long actorId, String action, String resourceType, Long resourceId, String result);
}
