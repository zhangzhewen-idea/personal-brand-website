package com.zhangzhewen.pbw.infrastructure.persistence.data;

import com.baomidou.mybatisplus.annotation.TableName;
import com.baomidou.mybatisplus.annotation.FieldStrategy;
import com.baomidou.mybatisplus.annotation.TableField;

@TableName("matrix_account")
public class MatrixAccountPO extends BasePO {
    private String platformName;
    @TableField(updateStrategy = FieldStrategy.ALWAYS)
    private String platformLogo;
    @TableField(updateStrategy = FieldStrategy.ALWAYS)
    private String accountUrl;
    @TableField(updateStrategy = FieldStrategy.ALWAYS)
    private String intro;

    public String getPlatformName() { return platformName; }
    public void setPlatformName(String value) { this.platformName = value; }
    public String getPlatformLogo() { return platformLogo; }
    public void setPlatformLogo(String value) { this.platformLogo = value; }
    public String getAccountUrl() { return accountUrl; }
    public void setAccountUrl(String value) { this.accountUrl = value; }
    public String getIntro() { return intro; }
    public void setIntro(String value) { this.intro = value; }
}
