package com.zhangzhewen.pbw.domain.shared;

public record PageCriteria(
        int page,
        int pageSize,
        String keyword,
        DeletionStatus status,
        String sortBy,
        SortOrder sortOrder
) {
    public enum DeletionStatus {
        ALL, NORMAL, DELETED;

        public static DeletionStatus from(String value) {
            return switch (value) {
                case "all" -> ALL;
                case "normal" -> NORMAL;
                case "deleted" -> DELETED;
                default -> throw BusinessException.badRequest("status 仅允许 all、normal、deleted");
            };
        }
    }

    public enum SortOrder {
        ASC, DESC;

        public static SortOrder from(String value) {
            return switch (value) {
                case "asc" -> ASC;
                case "desc" -> DESC;
                default -> throw BusinessException.badRequest("sortOrder 仅允许 asc、desc");
            };
        }
    }
}
