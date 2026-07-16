package com.zhangzhewen.pbw.domain.gateway;

import com.zhangzhewen.pbw.domain.content.Video;

import java.util.List;

public interface VideoGateway extends ManagedResourceGateway<Video> {
    List<Video> latestActive(int limit);

    List<Video> listActive();
}
