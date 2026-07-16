package com.zhangzhewen.pbw.infrastructure.persistence.data;

import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.FieldStrategy;
import com.baomidou.mybatisplus.annotation.TableName;

@TableName("users")
public class UserAccountPO extends BasePO {
    private String nickname;
    private String account;
    @TableField(updateStrategy = FieldStrategy.ALWAYS)
    private String password;
    private Boolean passwordConfigured;
    @TableField(updateStrategy = FieldStrategy.ALWAYS)
    private String email;
    @TableField(updateStrategy = FieldStrategy.ALWAYS)
    private String avatar;
    @TableField("`role`")
    private String role;

    public String getNickname() { return nickname; }
    public void setNickname(String value) { this.nickname = value; }
    public String getAccount() { return account; }
    public void setAccount(String value) { this.account = value; }
    public String getPassword() { return password; }
    public void setPassword(String value) { this.password = value; }
    public Boolean getPasswordConfigured() { return passwordConfigured; }
    public void setPasswordConfigured(Boolean value) { this.passwordConfigured = value; }
    public String getEmail() { return email; }
    public void setEmail(String value) { this.email = value; }
    public String getAvatar() { return avatar; }
    public void setAvatar(String value) { this.avatar = value; }
    public String getRole() { return role; }
    public void setRole(String value) { this.role = value; }
}
