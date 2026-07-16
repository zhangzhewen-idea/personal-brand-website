package com.zhangzhewen.pbw.infrastructure.persistence.gateway;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.zhangzhewen.pbw.domain.content.Video;
import com.zhangzhewen.pbw.domain.gateway.VideoGateway;
import com.zhangzhewen.pbw.infrastructure.persistence.data.VideoPO;
import com.zhangzhewen.pbw.infrastructure.persistence.mapper.VideoMapper;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Repository
public class VideoGatewayImpl extends AbstractManagedGateway<Video, VideoPO> implements VideoGateway {

    private final VideoMapper mapper;

    public VideoGatewayImpl(VideoMapper mapper) { this.mapper = mapper; }
    @Override protected BaseMapper<VideoPO> mapper() { return mapper; }
    @Override protected Map<String, String> sortColumns() { return Map.of("id", "`id`", "videoTitle", "`video_title`", "createTime", "`create_time`", "updateTime", "`update_time`"); }
    @Override protected void applyKeyword(QueryWrapper<VideoPO> w, String k) { w.and(q -> q.like("`video_title`", k).or().like("`video_intro`", k)); }
    @Override public List<Video> latestActive(int limit) { return mapper.selectList(new QueryWrapper<VideoPO>().eq("`is_deleted`", false).orderByDesc("`create_time`", "`id`").last("LIMIT " + limit)).stream().map(this::toDomain).toList(); }
    @Override public List<Video> listActive() { return listActiveByCreatedTime(); }

    @Override protected Video toDomain(VideoPO po) { return new Video(PersistenceSupport.toBase(po), po.getVideoTitle(), po.getVideoIntro(), po.getVideoUrl(), po.getVideoCover()); }
    @Override protected VideoPO toPO(Video v) { VideoPO po = new VideoPO(); PersistenceSupport.copyBase(v.base(), po); po.setVideoTitle(v.videoTitle()); po.setVideoIntro(v.videoIntro()); po.setVideoUrl(v.videoUrl()); po.setVideoCover(v.videoCover()); return po; }
}
