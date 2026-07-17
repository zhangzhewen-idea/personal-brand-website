package com.zhangzhewen.pbw.infrastructure.persistence.data;

import com.baomidou.mybatisplus.annotation.TableName;
import com.baomidou.mybatisplus.annotation.FieldStrategy;
import com.baomidou.mybatisplus.annotation.TableField;

import java.math.BigDecimal;

@TableName("material_library")
public class MaterialPO extends BasePO {
    private String materialTitle;
    @TableField(updateStrategy = FieldStrategy.ALWAYS)
    private String materialPhoto;
    @TableField(updateStrategy = FieldStrategy.ALWAYS)
    private String materialIntro;
    private BigDecimal price;
    private Integer stock;
    private String specifications;
    @TableField(updateStrategy = FieldStrategy.ALWAYS)
    private String netdiskUrl;
    private Integer itemCount;
    private String colorClass;
    private String iconName;

    public String getMaterialTitle() { return materialTitle; }
    public void setMaterialTitle(String value) { this.materialTitle = value; }
    public String getMaterialPhoto() { return materialPhoto; }
    public void setMaterialPhoto(String value) { this.materialPhoto = value; }
    public String getMaterialIntro() { return materialIntro; }
    public void setMaterialIntro(String value) { this.materialIntro = value; }
    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal value) { this.price = value; }
    public Integer getStock() { return stock; }
    public void setStock(Integer value) { this.stock = value; }
    public String getSpecifications() { return specifications; }
    public void setSpecifications(String value) { this.specifications = value; }
    public String getNetdiskUrl() { return netdiskUrl; }
    public void setNetdiskUrl(String value) { this.netdiskUrl = value; }
    public Integer getItemCount() { return itemCount; }
    public void setItemCount(Integer value) { this.itemCount = value; }
    public String getColorClass() { return colorClass; }
    public void setColorClass(String value) { this.colorClass = value; }
    public String getIconName() { return iconName; }
    public void setIconName(String value) { this.iconName = value; }
}
