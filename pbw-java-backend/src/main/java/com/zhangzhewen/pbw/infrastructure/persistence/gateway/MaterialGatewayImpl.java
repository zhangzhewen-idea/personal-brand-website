package com.zhangzhewen.pbw.infrastructure.persistence.gateway;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;
import com.zhangzhewen.pbw.domain.content.Material;
import com.zhangzhewen.pbw.domain.gateway.MaterialGateway;
import com.zhangzhewen.pbw.infrastructure.persistence.data.MaterialPO;
import com.zhangzhewen.pbw.infrastructure.persistence.mapper.MaterialMapper;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Repository
public class MaterialGatewayImpl extends AbstractManagedGateway<Material, MaterialPO> implements MaterialGateway {
    private final MaterialMapper mapper;
    private final ObjectMapper objectMapper;
    public MaterialGatewayImpl(MaterialMapper mapper, ObjectMapper objectMapper) { this.mapper = mapper; this.objectMapper = objectMapper; }
    @Override protected BaseMapper<MaterialPO> mapper() { return mapper; }
    @Override protected Map<String, String> sortColumns() { return Map.of("id", "`id`", "materialTitle", "`material_title`", "price", "`price`", "stock", "`stock`", "createTime", "`create_time`", "updateTime", "`update_time`"); }
    @Override protected void applyKeyword(QueryWrapper<MaterialPO> w, String k) { w.and(q -> q.like("`material_title`", k).or().like("`material_intro`", k)); }
    @Override public List<Material> listActive(int limit) { return mapper.selectList(new QueryWrapper<MaterialPO>().eq("`is_deleted`", false).orderByDesc("`create_time`", "`id`").last("LIMIT " + limit)).stream().map(this::toDomain).toList(); }
    @Override protected Material toDomain(MaterialPO po) { return new Material(PersistenceSupport.toBase(po), po.getMaterialTitle(), po.getMaterialPhoto(), po.getMaterialIntro(), po.getPrice(), po.getStock(), PersistenceSupport.readList(objectMapper, po.getSpecifications(), new TypeReference<List<Material.Specification>>() {}), po.getNetdiskUrl(), po.getItemCount(), po.getColorClass(), po.getIconName()); }
    @Override protected MaterialPO toPO(Material m) { MaterialPO po = new MaterialPO(); PersistenceSupport.copyBase(m.base(), po); po.setMaterialTitle(m.materialTitle()); po.setMaterialPhoto(m.materialPhoto()); po.setMaterialIntro(m.materialIntro()); po.setPrice(m.price()); po.setStock(m.stock()); po.setSpecifications(PersistenceSupport.writeJson(objectMapper, m.specifications())); po.setNetdiskUrl(m.netdiskUrl()); po.setItemCount(m.itemCount()); po.setColorClass(m.colorClass()); po.setIconName(m.iconName()); return po; }
}
