package com.zhangzhewen.pbw.infrastructure.persistence.data;

import com.baomidou.mybatisplus.annotation.TableName;
import com.baomidou.mybatisplus.annotation.FieldStrategy;
import com.baomidou.mybatisplus.annotation.TableField;

import java.math.BigDecimal;

@TableName("course")
public class CoursePO extends BasePO {
    private String courseName;
    @TableField(updateStrategy = FieldStrategy.ALWAYS)
    private String courseTag;
    @TableField(updateStrategy = FieldStrategy.ALWAYS)
    private String courseIntro;
    private BigDecimal coursePrice;
    private Boolean isOnline;

    public String getCourseName() { return courseName; }
    public void setCourseName(String value) { this.courseName = value; }
    public String getCourseTag() { return courseTag; }
    public void setCourseTag(String value) { this.courseTag = value; }
    public String getCourseIntro() { return courseIntro; }
    public void setCourseIntro(String value) { this.courseIntro = value; }
    public BigDecimal getCoursePrice() { return coursePrice; }
    public void setCoursePrice(BigDecimal value) { this.coursePrice = value; }
    public Boolean getIsOnline() { return isOnline; }
    public void setIsOnline(Boolean value) { this.isOnline = value; }
}
