package com.zhangzhewen.pbw.adapter.admin;

import com.zhangzhewen.pbw.application.AdminBasicInfoApplicationService;
import com.zhangzhewen.pbw.application.dto.admin.AdminBasicInfoDto.AdminBasicInfoRequest;
import com.zhangzhewen.pbw.application.dto.admin.AdminBasicInfoDto.AdminBasicInfoVO;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.net.URI;

@Tag(name = "管理员基本信息")
@RestController
@RequestMapping("/api/admin/basic-info")
public class AdminBasicInfoController {
    private final AdminBasicInfoApplicationService service;
    public AdminBasicInfoController(AdminBasicInfoApplicationService service) { this.service = service; }
    @GetMapping public AdminBasicInfoVO current() { return service.current(); }
    @PostMapping public ResponseEntity<AdminBasicInfoVO> create(@Valid @RequestBody AdminBasicInfoRequest request) { AdminBasicInfoVO vo = service.create(request); return ResponseEntity.created(URI.create("/api/admin/basic-info/" + vo.id())).body(vo); }
    @PutMapping("/{id}") public AdminBasicInfoVO update(@PathVariable Long id, @Valid @RequestBody AdminBasicInfoRequest request) { return service.update(id, request); }
}
