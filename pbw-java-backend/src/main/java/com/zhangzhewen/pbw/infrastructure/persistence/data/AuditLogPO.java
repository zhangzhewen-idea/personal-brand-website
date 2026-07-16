package com.zhangzhewen.pbw.infrastructure.persistence.data;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;

import java.time.LocalDateTime;

@TableName("audit_log")
public class AuditLogPO {
    @TableId(type = IdType.AUTO)
    private Long id;
    private Long actorId;
    private String actionName;
    private String resourceType;
    private Long resourceId;
    private String result;
    private LocalDateTime createTime;

    public Long getId() { return id; }
    public void setId(Long value) { this.id = value; }
    public Long getActorId() { return actorId; }
    public void setActorId(Long value) { this.actorId = value; }
    public String getActionName() { return actionName; }
    public void setActionName(String value) { this.actionName = value; }
    public String getResourceType() { return resourceType; }
    public void setResourceType(String value) { this.resourceType = value; }
    public Long getResourceId() { return resourceId; }
    public void setResourceId(Long value) { this.resourceId = value; }
    public String getResult() { return result; }
    public void setResult(String value) { this.result = value; }
    public LocalDateTime getCreateTime() { return createTime; }
    public void setCreateTime(LocalDateTime value) { this.createTime = value; }
}
