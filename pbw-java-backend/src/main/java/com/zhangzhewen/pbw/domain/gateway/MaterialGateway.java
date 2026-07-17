package com.zhangzhewen.pbw.domain.gateway;

import com.zhangzhewen.pbw.domain.content.Material;

import java.util.List;

public interface MaterialGateway extends ManagedResourceGateway<Material> {
    List<Material> listActive(int limit);
}
