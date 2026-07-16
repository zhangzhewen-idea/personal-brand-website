package com.zhangzhewen.pbw.infrastructure.persistence.gateway;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.conditions.update.UpdateWrapper;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.zhangzhewen.pbw.domain.gateway.ManagedResourceGateway;
import com.zhangzhewen.pbw.domain.shared.PageCriteria;
import com.zhangzhewen.pbw.domain.shared.PageData;
import com.zhangzhewen.pbw.infrastructure.persistence.data.BasePO;

import java.util.List;
import java.util.Map;
import java.util.Optional;

abstract class AbstractManagedGateway<T, P extends BasePO> implements ManagedResourceGateway<T> {

    protected abstract BaseMapper<P> mapper();

    protected abstract P toPO(T domain);

    protected abstract T toDomain(P po);

    protected abstract Map<String, String> sortColumns();

    protected abstract void applyKeyword(QueryWrapper<P> wrapper, String keyword);

    @Override
    public PageData<T> page(PageCriteria criteria) {
        QueryWrapper<P> query = new QueryWrapper<>();
        applyDeletionStatus(query, criteria.status());
        if (criteria.keyword() != null) {
            applyKeyword(query, criteria.keyword());
        }
        String column = sortColumns().get(criteria.sortBy());
        query.orderBy(true, criteria.sortOrder() == PageCriteria.SortOrder.ASC, column);
        query.orderBy(!"id".equals(criteria.sortBy()), criteria.sortOrder() == PageCriteria.SortOrder.ASC, "`id`");
        Page<P> result = mapper().selectPage(new Page<>(criteria.page(), criteria.pageSize()), query);
        return PageData.of(result.getRecords().stream().map(this::toDomain).toList(), result.getTotal(), criteria.page(), criteria.pageSize());
    }

    @Override
    public Optional<T> findById(Long id) {
        return Optional.ofNullable(mapper().selectById(id)).map(this::toDomain);
    }

    @Override
    public T insert(T entity) {
        P po = toPO(entity);
        mapper().insert(po);
        return findById(po.getId()).orElseThrow();
    }

    @Override
    public T update(T entity) {
        P po = toPO(entity);
        mapper().updateById(po);
        return findById(po.getId()).orElseThrow();
    }

    @Override
    public void setDeleted(Long id, boolean deleted) {
        mapper().update(new UpdateWrapper<P>().eq("`id`", id).set("`is_deleted`", deleted));
    }

    @Override
    public long countActive() {
        return mapper().selectCount(new QueryWrapper<P>().eq("`is_deleted`", false));
    }

    protected List<T> listActiveByCreatedTime() {
        return mapper().selectList(new QueryWrapper<P>().eq("`is_deleted`", false).orderByDesc("`create_time`", "`id`"))
                .stream().map(this::toDomain).toList();
    }

    private static void applyDeletionStatus(QueryWrapper<?> query, PageCriteria.DeletionStatus status) {
        if (status == PageCriteria.DeletionStatus.NORMAL) {
            query.eq("`is_deleted`", false);
        } else if (status == PageCriteria.DeletionStatus.DELETED) {
            query.eq("`is_deleted`", true);
        }
    }
}
