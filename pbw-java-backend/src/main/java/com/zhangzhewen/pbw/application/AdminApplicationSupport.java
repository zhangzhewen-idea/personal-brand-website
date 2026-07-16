package com.zhangzhewen.pbw.application;

import com.zhangzhewen.pbw.domain.gateway.AuditGateway;
import com.zhangzhewen.pbw.domain.gateway.CurrentActorGateway;
import com.zhangzhewen.pbw.domain.shared.BaseEntity;
import com.zhangzhewen.pbw.domain.shared.BusinessException;
import com.zhangzhewen.pbw.domain.shared.PageCriteria;
import com.zhangzhewen.pbw.domain.shared.PageData;
import com.zhangzhewen.pbw.application.dto.admin.AdminCommonDto.AdminPageVO;
import org.springframework.stereotype.Component;

import java.util.Set;
import java.util.function.Function;

public final class AdminApplicationSupport {

    private AdminApplicationSupport() {
    }

    public static BaseEntity newBase() {
        return new BaseEntity(null, null, null, false);
    }

    public static PageCriteria criteria(
            int page,
            int pageSize,
            String keyword,
            String status,
            String sortBy,
            String sortOrder,
            Set<String> allowedSortFields
    ) {
        if (page < 1) {
            throw BusinessException.badRequest("page 不能小于 1");
        }
        if (pageSize < 1 || pageSize > 100) {
            throw BusinessException.badRequest("pageSize 必须在 1-100 之间");
        }
        if (keyword != null && keyword.trim().length() > 100) {
            throw BusinessException.badRequest("keyword 最长 100 字符");
        }
        if (!allowedSortFields.contains(sortBy)) {
            throw BusinessException.badRequest("不支持的 sortBy: " + sortBy);
        }
        return new PageCriteria(
                page,
                pageSize,
                keyword == null || keyword.isBlank() ? null : keyword.trim(),
                PageCriteria.DeletionStatus.from(status),
                sortBy,
                PageCriteria.SortOrder.from(sortOrder)
        );
    }

    public static <T, R> AdminPageVO<R> pageVO(PageData<T> page, Function<T, R> mapper) {
        return new AdminPageVO<>(page.list().stream().map(mapper).toList(), page.total(), page.page(), page.pageSize(), page.totalPages());
    }

    public static String copyName(String original, int maxLength) {
        String suffix = "（副本）";
        int allowed = Math.max(0, maxLength - suffix.length());
        String prefix = original.length() > allowed ? original.substring(0, allowed) : original;
        return prefix + suffix;
    }

    @Component
    public static class AuditRecorder {
        private final CurrentActorGateway currentActorGateway;
        private final AuditGateway auditGateway;

        public AuditRecorder(CurrentActorGateway currentActorGateway, AuditGateway auditGateway) {
            this.currentActorGateway = currentActorGateway;
            this.auditGateway = auditGateway;
        }

        public void success(String action, String resourceType, Long resourceId) {
            auditGateway.record(currentActorGateway.currentUserId().orElse(null), action, resourceType, resourceId, "SUCCESS");
        }
    }
}
