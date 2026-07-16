package com.zhangzhewen.pbw.infrastructure.persistence.gateway;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;
import com.zhangzhewen.pbw.domain.content.BasicInfo;
import com.zhangzhewen.pbw.domain.gateway.BasicInfoGateway;
import com.zhangzhewen.pbw.infrastructure.persistence.data.BasicInfoPO;
import com.zhangzhewen.pbw.infrastructure.persistence.mapper.BasicInfoMapper;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public class BasicInfoGatewayImpl implements BasicInfoGateway {

    private final BasicInfoMapper mapper;
    private final ObjectMapper objectMapper;

    public BasicInfoGatewayImpl(BasicInfoMapper mapper, ObjectMapper objectMapper) {
        this.mapper = mapper;
        this.objectMapper = objectMapper;
    }

    @Override
    public Optional<BasicInfo> findCurrent() {
        return Optional.ofNullable(mapper.selectOne(new QueryWrapper<BasicInfoPO>()
                .eq("`is_deleted`", false).orderByDesc("`create_time`", "`id`").last("LIMIT 1"))).map(this::toDomain);
    }

    @Override
    public Optional<BasicInfo> findById(Long id) {
        return Optional.ofNullable(mapper.selectById(id)).map(this::toDomain);
    }

    @Override
    public BasicInfo insert(BasicInfo basicInfo) {
        BasicInfoPO po = toPO(basicInfo);
        mapper.insert(po);
        return findById(po.getId()).orElseThrow();
    }

    @Override
    public BasicInfo update(BasicInfo basicInfo) {
        BasicInfoPO po = toPO(basicInfo);
        mapper.updateById(po);
        return findById(po.getId()).orElseThrow();
    }

    private BasicInfo toDomain(BasicInfoPO po) {
        return new BasicInfo(PersistenceSupport.toBase(po), po.getHomeCoverVideo(), po.getContactEmail(), po.getContactQrCode(), po.getTotalPlayCount(), po.getTotalLikeCount(), po.getTotalFollowerCount(), po.getAuthorIdentityTag(), po.getSlogan(), po.getCreationAttitude(), po.getAuthorPhoto(), po.getEditingDeskWorkPhoto(), po.getAssetLibraryScreenshot(), po.getDailyMovieWatchingPhoto(), PersistenceSupport.readList(objectMapper, po.getAnnualTop10Films(), new TypeReference<List<String>>() {}), PersistenceSupport.readList(objectMapper, po.getInfluentialThreeDirectors(), new TypeReference<List<String>>() {}), po.getContactInfo());
    }

    private BasicInfoPO toPO(BasicInfo domain) {
        BasicInfoPO po = new BasicInfoPO();
        PersistenceSupport.copyBase(domain.base(), po);
        po.setHomeCoverVideo(domain.homeCoverVideo());
        po.setContactEmail(domain.contactEmail());
        po.setContactQrCode(domain.contactQrCode());
        po.setTotalPlayCount(domain.totalPlayCount());
        po.setTotalLikeCount(domain.totalLikeCount());
        po.setTotalFollowerCount(domain.totalFollowerCount());
        po.setAuthorIdentityTag(domain.authorIdentityTag());
        po.setSlogan(domain.slogan());
        po.setCreationAttitude(domain.creationAttitude());
        po.setAuthorPhoto(domain.authorPhoto());
        po.setEditingDeskWorkPhoto(domain.editingDeskWorkPhoto());
        po.setAssetLibraryScreenshot(domain.assetLibraryScreenshot());
        po.setDailyMovieWatchingPhoto(domain.dailyMovieWatchingPhoto());
        po.setAnnualTop10Films(PersistenceSupport.writeJson(objectMapper, domain.annualTop10Films()));
        po.setInfluentialThreeDirectors(PersistenceSupport.writeJson(objectMapper, domain.influentialThreeDirectors()));
        po.setContactInfo(domain.contactInfo());
        return po;
    }
}
