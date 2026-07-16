package com.zhangzhewen.pbw.domain.user;

import com.zhangzhewen.pbw.domain.shared.BaseEntity;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class UserAccountTest {

    @Test
    void plainPasswordLoginStillRequiresConfiguredAndActiveAccount() {
        UserAccount active = new UserAccount(new BaseEntity(1L, null, null, false), "用户", "user", "Password1", true, null, null, UserAccount.UserRole.USER);
        UserAccount copied = new UserAccount(new BaseEntity(2L, null, null, false), "副本", "copy", null, false, null, null, UserAccount.UserRole.USER);
        UserAccount deleted = new UserAccount(new BaseEntity(3L, null, null, true), "删除", "deleted", "Password1", true, null, null, UserAccount.UserRole.USER);

        assertThat(active.canLoginWith("Password1")).isTrue();
        assertThat(active.canLoginWith("wrong")).isFalse();
        assertThat(copied.canLoginWith("Password1")).isFalse();
        assertThat(deleted.canLoginWith("Password1")).isFalse();
    }
}
