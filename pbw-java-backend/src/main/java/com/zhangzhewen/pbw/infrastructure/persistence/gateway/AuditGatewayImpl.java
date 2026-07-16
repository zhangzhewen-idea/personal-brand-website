package com.zhangzhewen.pbw.infrastructure.persistence.gateway;

import com.zhangzhewen.pbw.domain.gateway.AuditGateway;
import com.zhangzhewen.pbw.infrastructure.persistence.data.AuditLogPO;
import com.zhangzhewen.pbw.infrastructure.persistence.mapper.AuditLogMapper;
import org.springframework.stereotype.Repository;

@Repository
public class AuditGatewayImpl implements AuditGateway {
    private final AuditLogMapper mapper;
    public AuditGatewayImpl(AuditLogMapper mapper) { this.mapper = mapper; }
    @Override public void record(Long actorId, String action, String resourceType, Long resourceId, String result) {
        AuditLogPO po = new AuditLogPO();
        po.setActorId(actorId); po.setActionName(action); po.setResourceType(resourceType); po.setResourceId(resourceId); po.setResult(result);
        mapper.insert(po);
    }
}
