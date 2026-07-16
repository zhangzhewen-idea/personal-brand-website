package com.zhangzhewen.pbw.infrastructure.persistence.gateway;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.zhangzhewen.pbw.domain.content.Course;
import com.zhangzhewen.pbw.domain.gateway.CourseGateway;
import com.zhangzhewen.pbw.infrastructure.persistence.data.CoursePO;
import com.zhangzhewen.pbw.infrastructure.persistence.mapper.CourseMapper;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Repository
public class CourseGatewayImpl extends AbstractManagedGateway<Course, CoursePO> implements CourseGateway {
    private final CourseMapper mapper;
    public CourseGatewayImpl(CourseMapper mapper) { this.mapper = mapper; }
    @Override protected BaseMapper<CoursePO> mapper() { return mapper; }
    @Override protected Map<String, String> sortColumns() { return Map.of("id", "`id`", "courseName", "`course_name`", "coursePrice", "`course_price`", "isOnline", "`is_online`", "createTime", "`create_time`", "updateTime", "`update_time`"); }
    @Override protected void applyKeyword(QueryWrapper<CoursePO> w, String k) { w.and(q -> q.like("`course_name`", k).or().like("`course_tag`", k)); }
    @Override public long countOnlineActive() { return mapper.selectCount(new QueryWrapper<CoursePO>().eq("`is_deleted`", false).eq("`is_online`", true)); }
    @Override public List<Course> listOnlineActive() { return mapper.selectList(new QueryWrapper<CoursePO>().eq("`is_deleted`", false).eq("`is_online`", true).orderByDesc("`create_time`", "`id`")).stream().map(this::toDomain).toList(); }
    @Override protected Course toDomain(CoursePO po) { return new Course(PersistenceSupport.toBase(po), po.getCourseName(), po.getCourseTag(), po.getCourseIntro(), po.getCoursePrice(), Boolean.TRUE.equals(po.getIsOnline())); }
    @Override protected CoursePO toPO(Course c) { CoursePO po = new CoursePO(); PersistenceSupport.copyBase(c.base(), po); po.setCourseName(c.courseName()); po.setCourseTag(c.courseTag()); po.setCourseIntro(c.courseIntro()); po.setCoursePrice(c.coursePrice()); po.setIsOnline(c.online()); return po; }
}
