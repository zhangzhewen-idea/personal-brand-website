package com.zhangzhewen.pbw.adapter.user;

import com.zhangzhewen.pbw.application.UserAuthApplicationService;
import com.zhangzhewen.pbw.application.dto.user.UserAuthDto.UserPasswordResetAcceptedVO;
import com.zhangzhewen.pbw.application.dto.user.UserAuthDto.UserPasswordResetConfirmRequest;
import com.zhangzhewen.pbw.application.dto.user.UserAuthDto.UserPasswordResetRequest;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "用户端密码重置")
@RestController
@RequestMapping("/api/user")
public class UserPasswordResetController {
    private final UserAuthApplicationService service;

    public UserPasswordResetController(UserAuthApplicationService service) {
        this.service = service;
    }

    @PostMapping("/password-reset-requests")
    public ResponseEntity<UserPasswordResetAcceptedVO> request(@Valid @RequestBody UserPasswordResetRequest request) {
        return ResponseEntity.accepted().body(service.requestPasswordReset(request));
    }

    @PostMapping("/password-resets")
    public ResponseEntity<Void> reset(@Valid @RequestBody UserPasswordResetConfirmRequest request) {
        service.resetPassword(request);
        return ResponseEntity.noContent().build();
    }
}
