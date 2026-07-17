package com.zhangzhewen.pbw.infrastructure.persistence.data;

import com.baomidou.mybatisplus.annotation.TableName;
import com.baomidou.mybatisplus.annotation.FieldStrategy;
import com.baomidou.mybatisplus.annotation.TableField;

@TableName("basic_info")
public class BasicInfoPO extends BasePO {
    private String homeCoverVideo;
    @TableField(updateStrategy = FieldStrategy.ALWAYS)
    private String contactEmail;
    @TableField(updateStrategy = FieldStrategy.ALWAYS)
    private String contactQrCode;
    private Long totalPlayCount;
    private Long totalLikeCount;
    private Long totalFollowerCount;
    private String authorIdentityTag;
    private String slogan;
    @TableField(updateStrategy = FieldStrategy.ALWAYS)
    private String creationAttitude;
    @TableField(updateStrategy = FieldStrategy.ALWAYS)
    private String authorPhoto;
    @TableField(updateStrategy = FieldStrategy.ALWAYS)
    private String editingDeskWorkPhoto;
    @TableField(updateStrategy = FieldStrategy.ALWAYS)
    private String assetLibraryScreenshot;
    @TableField(updateStrategy = FieldStrategy.ALWAYS)
    private String dailyMovieWatchingPhoto;
    @TableField(value = "annual_top_10_films")
    private String annualTop10Films;
    private String influentialThreeDirectors;
    @TableField(updateStrategy = FieldStrategy.ALWAYS)
    private String contactInfo;

    public String getHomeCoverVideo() { return homeCoverVideo; }
    public void setHomeCoverVideo(String value) { this.homeCoverVideo = value; }
    public String getContactEmail() { return contactEmail; }
    public void setContactEmail(String value) { this.contactEmail = value; }
    public String getContactQrCode() { return contactQrCode; }
    public void setContactQrCode(String value) { this.contactQrCode = value; }
    public Long getTotalPlayCount() { return totalPlayCount; }
    public void setTotalPlayCount(Long value) { this.totalPlayCount = value; }
    public Long getTotalLikeCount() { return totalLikeCount; }
    public void setTotalLikeCount(Long value) { this.totalLikeCount = value; }
    public Long getTotalFollowerCount() { return totalFollowerCount; }
    public void setTotalFollowerCount(Long value) { this.totalFollowerCount = value; }
    public String getAuthorIdentityTag() { return authorIdentityTag; }
    public void setAuthorIdentityTag(String value) { this.authorIdentityTag = value; }
    public String getSlogan() { return slogan; }
    public void setSlogan(String value) { this.slogan = value; }
    public String getCreationAttitude() { return creationAttitude; }
    public void setCreationAttitude(String value) { this.creationAttitude = value; }
    public String getAuthorPhoto() { return authorPhoto; }
    public void setAuthorPhoto(String value) { this.authorPhoto = value; }
    public String getEditingDeskWorkPhoto() { return editingDeskWorkPhoto; }
    public void setEditingDeskWorkPhoto(String value) { this.editingDeskWorkPhoto = value; }
    public String getAssetLibraryScreenshot() { return assetLibraryScreenshot; }
    public void setAssetLibraryScreenshot(String value) { this.assetLibraryScreenshot = value; }
    public String getDailyMovieWatchingPhoto() { return dailyMovieWatchingPhoto; }
    public void setDailyMovieWatchingPhoto(String value) { this.dailyMovieWatchingPhoto = value; }
    public String getAnnualTop10Films() { return annualTop10Films; }
    public void setAnnualTop10Films(String value) { this.annualTop10Films = value; }
    public String getInfluentialThreeDirectors() { return influentialThreeDirectors; }
    public void setInfluentialThreeDirectors(String value) { this.influentialThreeDirectors = value; }
    public String getContactInfo() { return contactInfo; }
    public void setContactInfo(String value) { this.contactInfo = value; }
}
