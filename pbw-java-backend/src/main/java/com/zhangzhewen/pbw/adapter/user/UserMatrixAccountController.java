package com.zhangzhewen.pbw.adapter.user;

import com.zhangzhewen.pbw.application.UserContentApplicationService;
import com.zhangzhewen.pbw.application.dto.user.UserContentDto.UserMatrixAccountVO;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Tag(name = "用户端矩阵账号")
@RestController
@RequestMapping("/api/user/matrix-accounts")
public class UserMatrixAccountController {
    private final UserContentApplicationService service;

    public UserMatrixAccountController(UserContentApplicationService service) {
        this.service = service;
    }

    @GetMapping
    public List<UserMatrixAccountVO> matrixAccounts() {
        return service.matrixAccounts();
    }
}
