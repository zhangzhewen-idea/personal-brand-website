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
    @TableField(updateStrategy = FieldStrategy.ALWAYS)
    private String duration;
    private Integer lessonCount;
    private String features;
    private String colorClass;
    private String iconName;
    private Boolean userVisible;

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
    public String getDuration() { return duration; }
    public void setDuration(String value) { this.duration = value; }
    public Integer getLessonCount() { return lessonCount; }
    public void setLessonCount(Integer value) { this.lessonCount = value; }
    public String getFeatures() { return features; }
    public void setFeatures(String value) { this.features = value; }
    public String getColorClass() { return colorClass; }
    public void setColorClass(String value) { this.colorClass = value; }
    public String getIconName() { return iconName; }
    public void setIconName(String value) { this.iconName = value; }
    public Boolean getUserVisible() { return userVisible; }
    public void setUserVisible(Boolean value) { this.userVisible = value; }
}
