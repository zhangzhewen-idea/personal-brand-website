package com.zhangzhewen.pbw.domain.gateway;

import com.zhangzhewen.pbw.domain.content.BasicInfo;

import java.util.Optional;

public interface BasicInfoGateway {
    Optional<BasicInfo> findCurrent();

    Optional<BasicInfo> findById(Long id);

    BasicInfo insert(BasicInfo basicInfo);

    BasicInfo update(BasicInfo basicInfo);
}
