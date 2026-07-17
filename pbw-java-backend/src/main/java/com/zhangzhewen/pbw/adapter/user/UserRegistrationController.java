package com.zhangzhewen.pbw.adapter.user;

import com.zhangzhewen.pbw.application.UserAuthApplicationService;
import com.zhangzhewen.pbw.application.dto.user.UserAuthDto.UserLoginVO;
import com.zhangzhewen.pbw.application.dto.user.UserAuthDto.UserRegisterRequest;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.net.URI;

@Tag(name = "用户端注册")
@RestController
@RequestMapping("/api/user/users")
public class UserRegistrationController {
    private final UserAuthApplicationService service;

    public UserRegistrationController(UserAuthApplicationService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<UserLoginVO> register(@Valid @RequestBody UserRegisterRequest request) {
        UserLoginVO result = service.register(request);
        return ResponseEntity.created(URI.create("/api/user/users/" + result.user().id())).body(result);
    }
}
