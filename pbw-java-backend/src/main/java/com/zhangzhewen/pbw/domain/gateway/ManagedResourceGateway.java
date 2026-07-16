package com.zhangzhewen.pbw.domain.gateway;

import com.zhangzhewen.pbw.domain.shared.PageCriteria;
import com.zhangzhewen.pbw.domain.shared.PageData;

import java.util.Optional;

public interface ManagedResourceGateway<T> {
    PageData<T> page(PageCriteria criteria);

    Optional<T> findById(Long id);

    T insert(T entity);

    T update(T entity);

    void setDeleted(Long id, boolean deleted);

    long countActive();
}
