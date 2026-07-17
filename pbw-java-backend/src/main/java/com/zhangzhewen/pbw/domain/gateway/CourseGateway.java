package com.zhangzhewen.pbw.domain.gateway;

import com.zhangzhewen.pbw.domain.content.Course;

import java.util.List;

public interface CourseGateway extends ManagedResourceGateway<Course> {
    long countOnlineActive();

    List<Course> listOnlineActive();

    List<Course> listUserVisible();
}
