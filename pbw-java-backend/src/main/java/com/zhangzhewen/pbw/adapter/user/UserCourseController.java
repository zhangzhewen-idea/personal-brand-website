package com.zhangzhewen.pbw.adapter.user;

import com.zhangzhewen.pbw.application.UserContentApplicationService;
import com.zhangzhewen.pbw.application.dto.user.UserContentDto.UserCourseVO;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Tag(name = "用户端课程")
@RestController
@RequestMapping("/api/user/courses")
public class UserCourseController {
    private final UserContentApplicationService service;

    public UserCourseController(UserContentApplicationService service) {
        this.service = service;
    }

    @GetMapping
    public List<UserCourseVO> courses() {
        return service.courses();
    }
}
