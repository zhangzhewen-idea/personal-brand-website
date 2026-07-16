package com.zhangzhewen.pbw.adapter.admin;

import com.zhangzhewen.pbw.application.AdminAuthApplicationService;
import com.zhangzhewen.pbw.application.dto.admin.AdminAuthDto.AdminPasswordResetAcceptedVO;
import com.zhangzhewen.pbw.application.dto.admin.AdminAuthDto.AdminPasswordResetConfirmRequest;
import com.zhangzhewen.pbw.application.dto.admin.AdminAuthDto.AdminPasswordResetRequest;
import com.zhangzhewen.pbw.application.dto.admin.AdminAuthDto.AdminPasswordResetResultVO;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "管理员密码重置")
@RestController
@RequestMapping("/api/admin")
public class AdminPasswordResetController {
    private final AdminAuthApplicationService service;
    public AdminPasswordResetController(AdminAuthApplicationService service) { this.service = service; }
    @PostMapping("/password-reset-requests") public ResponseEntity<AdminPasswordResetAcceptedVO> request(@Valid @RequestBody AdminPasswordResetRequest request) { return ResponseEntity.accepted().body(service.requestPasswordReset(request)); }
    @PostMapping("/password-resets") public AdminPasswordResetResultVO reset(@Valid @RequestBody AdminPasswordResetConfirmRequest request) { return service.resetPassword(request); }
}
