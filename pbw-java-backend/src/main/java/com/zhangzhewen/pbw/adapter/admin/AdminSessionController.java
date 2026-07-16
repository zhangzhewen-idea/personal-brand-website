package com.zhangzhewen.pbw.adapter.admin;

import com.zhangzhewen.pbw.application.AdminAuthApplicationService;
import com.zhangzhewen.pbw.application.dto.admin.AdminAuthDto.AdminLoginRequest;
import com.zhangzhewen.pbw.application.dto.admin.AdminAuthDto.AdminLoginVO;
import com.zhangzhewen.pbw.application.dto.admin.AdminAuthDto.AdminSessionVO;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "管理员认证")
@RestController
@RequestMapping("/api/admin/session")
public class AdminSessionController {
    private final AdminAuthApplicationService service;
    public AdminSessionController(AdminAuthApplicationService service) { this.service = service; }
    @PostMapping public AdminLoginVO login(@Valid @RequestBody AdminLoginRequest request) { return service.login(request); }
    @GetMapping public AdminSessionVO current() { return service.current(); }
    @DeleteMapping public ResponseEntity<Void> logout() { service.logout(); return ResponseEntity.noContent().build(); }
}
