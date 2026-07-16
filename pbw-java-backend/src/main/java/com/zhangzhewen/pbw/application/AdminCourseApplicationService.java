package com.zhangzhewen.pbw.application;

import com.zhangzhewen.pbw.application.AdminApplicationSupport.AuditRecorder;
import com.zhangzhewen.pbw.application.dto.admin.AdminCommonDto.AdminPageVO;
import com.zhangzhewen.pbw.application.dto.admin.AdminCourseDto.AdminCourseRequest;
import com.zhangzhewen.pbw.application.dto.admin.AdminCourseDto.AdminCourseVO;
import com.zhangzhewen.pbw.domain.content.Course;
import com.zhangzhewen.pbw.domain.gateway.CourseGateway;
import com.zhangzhewen.pbw.domain.shared.BusinessException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;

@Service
public class AdminCourseApplicationService {

    private static final Set<String> SORT_FIELDS = Set.of("id", "courseName", "coursePrice", "isOnline", "createTime", "updateTime");
    private final CourseGateway gateway;
    private final AuditRecorder audit;

    public AdminCourseApplicationService(CourseGateway gateway, AuditRecorder audit) {
        this.gateway = gateway;
        this.audit = audit;
    }

    @Transactional(readOnly = true)
    public AdminPageVO<AdminCourseVO> page(int page, int pageSize, String keyword, String status, String sortBy, String sortOrder) {
        return AdminApplicationSupport.pageVO(gateway.page(AdminApplicationSupport.criteria(page, pageSize, keyword, status, sortBy, sortOrder, SORT_FIELDS)), AdminCourseApplicationService::toVO);
    }

    @Transactional(readOnly = true)
    public AdminCourseVO detail(Long id) {
        return toVO(required(id));
    }

    @Transactional
    public AdminCourseVO create(AdminCourseRequest request) {
        Course saved = gateway.insert(fromRequest(AdminApplicationSupport.newBase(), request));
        audit.success("CREATE", "course", saved.base().id());
        return toVO(saved);
    }

    @Transactional
    public AdminCourseVO update(Long id, AdminCourseRequest request) {
        Course old = requiredActive(id);
        Course saved = gateway.update(fromRequest(old.base(), request));
        audit.success("UPDATE", "course", id);
        return toVO(saved);
    }

    @Transactional
    public AdminCourseVO copy(Long id) {
        Course old = required(id);
        Course saved = gateway.insert(new Course(AdminApplicationSupport.newBase(), AdminApplicationSupport.copyName(old.courseName(), 255), old.courseTag(), old.courseIntro(), old.coursePrice(), old.online()));
        audit.success("COPY", "course", saved.base().id());
        return toVO(saved);
    }

    @Transactional
    public void delete(Long id) {
        required(id);
        gateway.setDeleted(id, true);
        audit.success("DELETE", "course", id);
    }

    @Transactional
    public AdminCourseVO restore(Long id) {
        required(id);
        gateway.setDeleted(id, false);
        audit.success("RESTORE", "course", id);
        return toVO(required(id));
    }

    private Course required(Long id) {
        return gateway.findById(id).orElseThrow(() -> BusinessException.notFound("课程", id));
    }

    private Course requiredActive(Long id) {
        Course course = required(id);
        if (course.base().deleted()) {
            throw BusinessException.deleted("已删除课程不能编辑，请先恢复");
        }
        return course;
    }

    private static Course fromRequest(com.zhangzhewen.pbw.domain.shared.BaseEntity base, AdminCourseRequest request) {
        return new Course(base, request.courseName(), request.courseTag(), request.courseIntro(), request.coursePrice(), request.isOnline());
    }

    public static AdminCourseVO toVO(Course course) {
        return new AdminCourseVO(course.base().id(), course.courseName(), course.courseTag(), course.courseIntro(), course.coursePrice(), course.online(), course.base().createTime(), course.base().updateTime(), course.base().deleted());
    }
}
