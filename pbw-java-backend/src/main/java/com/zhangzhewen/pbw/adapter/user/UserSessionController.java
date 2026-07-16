package com.zhangzhewen.pbw.adapter.user;

import com.zhangzhewen.pbw.application.UserAuthApplicationService;
import com.zhangzhewen.pbw.application.dto.user.UserAuthDto.UserLoginRequest;
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

@Tag(name = "用户端认证")
@RestController
@RequestMapping("/api/user")
public class UserSessionController {
    private final UserAuthApplicationService service;
    public UserSessionController(UserAuthApplicationService service) { this.service = service; }
    @PostMapping("/session") public UserLoginVO login(@Valid @RequestBody UserLoginRequest request) { return service.login(request); }
    @PostMapping("/users") public ResponseEntity<UserLoginVO> register(@Valid @RequestBody UserRegisterRequest request) { UserLoginVO vo = service.register(request); return ResponseEntity.created(URI.create("/api/user/users/" + vo.user().id())).body(vo); }
}
