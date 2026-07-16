package com.zhangzhewen.pbw.infrastructure.persistence.gateway;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.zhangzhewen.pbw.domain.content.MatrixAccount;
import com.zhangzhewen.pbw.domain.gateway.MatrixAccountGateway;
import com.zhangzhewen.pbw.infrastructure.persistence.data.MatrixAccountPO;
import com.zhangzhewen.pbw.infrastructure.persistence.mapper.MatrixAccountMapper;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Repository
public class MatrixAccountGatewayImpl extends AbstractManagedGateway<MatrixAccount, MatrixAccountPO> implements MatrixAccountGateway {
    private final MatrixAccountMapper mapper;
    public MatrixAccountGatewayImpl(MatrixAccountMapper mapper) { this.mapper = mapper; }
    @Override protected BaseMapper<MatrixAccountPO> mapper() { return mapper; }
    @Override protected Map<String, String> sortColumns() { return Map.of("id", "`id`", "platformName", "`platform_name`", "createTime", "`create_time`", "updateTime", "`update_time`"); }
    @Override protected void applyKeyword(QueryWrapper<MatrixAccountPO> w, String k) { w.and(q -> q.like("`platform_name`", k).or().like("`intro`", k)); }
    @Override public List<MatrixAccount> listActive() { return listActiveByCreatedTime(); }
    @Override protected MatrixAccount toDomain(MatrixAccountPO po) { return new MatrixAccount(PersistenceSupport.toBase(po), po.getPlatformName(), po.getPlatformLogo(), po.getAccountUrl(), po.getIntro()); }
    @Override protected MatrixAccountPO toPO(MatrixAccount m) { MatrixAccountPO po = new MatrixAccountPO(); PersistenceSupport.copyBase(m.base(), po); po.setPlatformName(m.platformName()); po.setPlatformLogo(m.platformLogo()); po.setAccountUrl(m.accountUrl()); po.setIntro(m.intro()); return po; }
}
