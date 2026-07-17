package com.zhangzhewen.pbw.infrastructure.persistence.gateway;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.conditions.update.UpdateWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.zhangzhewen.pbw.domain.gateway.UserAccountGateway;
import com.zhangzhewen.pbw.domain.shared.PageCriteria;
import com.zhangzhewen.pbw.domain.shared.PageData;
import com.zhangzhewen.pbw.domain.user.UserAccount;
import com.zhangzhewen.pbw.domain.user.UserAccount.UserRole;
import com.zhangzhewen.pbw.infrastructure.persistence.data.UserAccountPO;
import com.zhangzhewen.pbw.infrastructure.persistence.mapper.UserAccountMapper;
import org.springframework.stereotype.Repository;

import java.util.Map;
import java.util.Optional;

@Repository
public class UserAccountGatewayImpl implements UserAccountGateway {
    private static final Map<String, String> SORT_COLUMNS = Map.of("id", "`id`", "nickname", "`nickname`", "account", "`account`", "role", "`role`", "createTime", "`create_time`", "updateTime", "`update_time`");
    private final UserAccountMapper mapper;
    public UserAccountGatewayImpl(UserAccountMapper mapper) { this.mapper = mapper; }

    @Override public PageData<UserAccount> page(PageCriteria c) {
        QueryWrapper<UserAccountPO> q = new QueryWrapper<>();
        if (c.status() == PageCriteria.DeletionStatus.NORMAL) q.eq("`is_deleted`", false);
        if (c.status() == PageCriteria.DeletionStatus.DELETED) q.eq("`is_deleted`", true);
        if (c.keyword() != null) q.and(w -> w.like("`nickname`", c.keyword()).or().like("`account`", c.keyword()).or().like("`email`", c.keyword()));
        boolean asc = c.sortOrder() == PageCriteria.SortOrder.ASC;
        q.orderBy(true, asc, SORT_COLUMNS.get(c.sortBy())).orderBy(!"id".equals(c.sortBy()), asc, "`id`");
        Page<UserAccountPO> result = mapper.selectPage(new Page<>(c.page(), c.pageSize()), q);
        return PageData.of(result.getRecords().stream().map(this::toDomain).toList(), result.getTotal(), c.page(), c.pageSize());
    }
    @Override public Optional<UserAccount> findById(Long id) { return Optional.ofNullable(mapper.selectById(id)).map(this::toDomain); }
    @Override public Optional<UserAccount> findByAccount(String account) { return Optional.ofNullable(mapper.selectOne(new QueryWrapper<UserAccountPO>().eq("`account`", account).last("LIMIT 1"))).map(this::toDomain); }
    @Override public Optional<UserAccount> findAdminByAccountOrEmail(String value) { return Optional.ofNullable(mapper.selectOne(new QueryWrapper<UserAccountPO>().eq("`is_deleted`", false).eq("`role`", "管理员").and(q -> q.eq("`account`", value).or().eq("`email`", value)).last("LIMIT 1"))).map(this::toDomain); }
    @Override public Optional<UserAccount> findUserByAccountOrEmail(String value) { return Optional.ofNullable(mapper.selectOne(new QueryWrapper<UserAccountPO>().eq("`is_deleted`", false).eq("`role`", "用户").and(q -> q.eq("`account`", value).or().eq("`email`", value)).last("LIMIT 1"))).map(this::toDomain); }
    @Override public boolean accountExists(String account, Long excludingId) { QueryWrapper<UserAccountPO> q = new QueryWrapper<UserAccountPO>().eq("`account`", account); if (excludingId != null) q.ne("`id`", excludingId); return mapper.selectCount(q) > 0; }
    @Override public boolean emailExists(String email, Long excludingId) { QueryWrapper<UserAccountPO> q = new QueryWrapper<UserAccountPO>().eq("`email`", email); if (excludingId != null) q.ne("`id`", excludingId); return mapper.selectCount(q) > 0; }
    @Override public long countActive() { return mapper.selectCount(new QueryWrapper<UserAccountPO>().eq("`is_deleted`", false)); }
    @Override public long countActiveAdmins() { return mapper.selectCount(new QueryWrapper<UserAccountPO>().eq("`is_deleted`", false).eq("`role`", "管理员")); }
    @Override public UserAccount insert(UserAccount user) { UserAccountPO po = toPO(user); mapper.insert(po); return findById(po.getId()).orElseThrow(); }
    @Override public UserAccount update(UserAccount user) { UserAccountPO po = toPO(user); mapper.updateById(po); return findById(po.getId()).orElseThrow(); }
    @Override public void setDeleted(Long id, boolean deleted) { mapper.update(new UpdateWrapper<UserAccountPO>().eq("`id`", id).set("`is_deleted`", deleted)); }

    private UserAccount toDomain(UserAccountPO po) { return new UserAccount(PersistenceSupport.toBase(po), po.getNickname(), po.getAccount(), po.getPassword(), Boolean.TRUE.equals(po.getPasswordConfigured()), po.getEmail(), po.getAvatar(), UserRole.fromDisplayName(po.getRole())); }
    private UserAccountPO toPO(UserAccount u) { UserAccountPO po = new UserAccountPO(); PersistenceSupport.copyBase(u.base(), po); po.setNickname(u.nickname()); po.setAccount(u.account()); po.setPassword(u.password()); po.setPasswordConfigured(u.passwordConfigured()); po.setEmail(u.email()); po.setAvatar(u.avatar()); po.setRole(u.role().displayName()); return po; }
}
