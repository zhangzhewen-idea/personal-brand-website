package com.zhangzhewen.pbw.infrastructure.persistence.data;

import com.baomidou.mybatisplus.annotation.TableName;
import com.baomidou.mybatisplus.annotation.FieldStrategy;
import com.baomidou.mybatisplus.annotation.TableField;

@TableName("video")
public class VideoPO extends BasePO {
    private String videoTitle;
    @TableField(updateStrategy = FieldStrategy.ALWAYS)
    private String videoIntro;
    private String videoUrl;
    @TableField(updateStrategy = FieldStrategy.ALWAYS)
    private String videoCover;
    @TableField(updateStrategy = FieldStrategy.ALWAYS)
    private String platformName;
    @TableField(updateStrategy = FieldStrategy.ALWAYS)
    private String playCountText;

    public String getVideoTitle() { return videoTitle; }
    public void setVideoTitle(String value) { this.videoTitle = value; }
    public String getVideoIntro() { return videoIntro; }
    public void setVideoIntro(String value) { this.videoIntro = value; }
    public String getVideoUrl() { return videoUrl; }
    public void setVideoUrl(String value) { this.videoUrl = value; }
    public String getVideoCover() { return videoCover; }
    public void setVideoCover(String value) { this.videoCover = value; }
    public String getPlatformName() { return platformName; }
    public void setPlatformName(String value) { this.platformName = value; }
    public String getPlayCountText() { return playCountText; }
    public void setPlayCountText(String value) { this.playCountText = value; }
}
