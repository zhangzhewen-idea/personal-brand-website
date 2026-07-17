package com.zhangzhewen.pbw.adapter.user;

import com.zhangzhewen.pbw.application.UserAuthApplicationService;
import com.zhangzhewen.pbw.application.dto.user.UserAuthDto.UserLoginRequest;
import com.zhangzhewen.pbw.application.dto.user.UserAuthDto.UserLoginVO;
import com.zhangzhewen.pbw.application.dto.user.UserAuthDto.UserProfileVO;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "用户端认证")
@RestController
@RequestMapping("/api/user/session")
public class UserSessionController {
    private final UserAuthApplicationService service;
    public UserSessionController(UserAuthApplicationService service) { this.service = service; }
    @PostMapping public UserLoginVO login(@Valid @RequestBody UserLoginRequest request) { return service.login(request); }
    @GetMapping public UserProfileVO current() { return service.current(); }
    @DeleteMapping public ResponseEntity<Void> logout() { service.logout(); return ResponseEntity.noContent().build(); }
}
