package com.zhangzhewen.pbw.domain.gateway;

import com.zhangzhewen.pbw.domain.shared.PageCriteria;
import com.zhangzhewen.pbw.domain.shared.PageData;
import com.zhangzhewen.pbw.domain.user.UserAccount;

import java.util.Optional;

public interface UserAccountGateway {
    PageData<UserAccount> page(PageCriteria criteria);

    Optional<UserAccount> findById(Long id);

    Optional<UserAccount> findByAccount(String account);

    Optional<UserAccount> findAdminByAccountOrEmail(String accountOrEmail);

    Optional<UserAccount> findUserByAccountOrEmail(String accountOrEmail);

    boolean accountExists(String account, Long excludingId);

    boolean emailExists(String email, Long excludingId);

    long countActive();

    long countActiveAdmins();

    UserAccount insert(UserAccount userAccount);

    UserAccount update(UserAccount userAccount);

    void setDeleted(Long id, boolean deleted);
}
