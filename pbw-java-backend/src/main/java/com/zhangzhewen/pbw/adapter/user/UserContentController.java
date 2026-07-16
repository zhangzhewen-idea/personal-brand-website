package com.zhangzhewen.pbw.adapter.user;

import com.zhangzhewen.pbw.application.UserContentApplicationService;
import com.zhangzhewen.pbw.application.dto.user.UserContentDto.UserBasicInfoVO;
import com.zhangzhewen.pbw.application.dto.user.UserContentDto.UserCourseVO;
import com.zhangzhewen.pbw.application.dto.user.UserContentDto.UserMaterialVO;
import com.zhangzhewen.pbw.application.dto.user.UserContentDto.UserMatrixAccountVO;
import com.zhangzhewen.pbw.application.dto.user.UserContentDto.UserVideoVO;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Tag(name = "用户端内容")
@RestController
@RequestMapping("/api/user")
public class UserContentController {
    private final UserContentApplicationService service;
    public UserContentController(UserContentApplicationService service) { this.service = service; }
    @GetMapping("/basic-info") public UserBasicInfoVO basicInfo() { return service.basicInfo(); }
    @GetMapping("/videos") public List<UserVideoVO> videos() { return service.videos(); }
    @GetMapping("/materials") public List<UserMaterialVO> materials() { return service.materials(); }
    @GetMapping("/matrix-accounts") public List<UserMatrixAccountVO> matrixAccounts() { return service.matrixAccounts(); }
    @GetMapping("/courses") public List<UserCourseVO> courses() { return service.courses(); }
}
