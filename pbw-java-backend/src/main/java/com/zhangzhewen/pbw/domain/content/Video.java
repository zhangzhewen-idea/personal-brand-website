package com.zhangzhewen.pbw.domain.content;

import com.zhangzhewen.pbw.domain.shared.BaseEntity;

public record Video(
        BaseEntity base,
        String videoTitle,
        String videoIntro,
        String videoUrl,
        String videoCover,
        String platformName,
        String playCountText
) {
    public Video(BaseEntity base, String videoTitle, String videoIntro, String videoUrl, String videoCover) {
        this(base, videoTitle, videoIntro, videoUrl, videoCover, null, null);
    }
}
