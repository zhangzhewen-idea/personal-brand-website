package com.zhangzhewen.pbw.adapter.admin;

import com.zhangzhewen.pbw.application.AdminVideoApplicationService;
import com.zhangzhewen.pbw.application.dto.admin.AdminCommonDto.AdminPageVO;
import com.zhangzhewen.pbw.application.dto.admin.AdminCommonDto.AdminRestoreRequest;
import com.zhangzhewen.pbw.application.dto.admin.AdminVideoDto.AdminVideoRequest;
import com.zhangzhewen.pbw.application.dto.admin.AdminVideoDto.AdminVideoVO;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.net.URI;

@Tag(name = "管理员视频")
@RestController
@RequestMapping("/api/admin/videos")
public class AdminVideoController {
    private final AdminVideoApplicationService service;
    public AdminVideoController(AdminVideoApplicationService service) { this.service = service; }
    @GetMapping public AdminPageVO<AdminVideoVO> page(@RequestParam(defaultValue = "1") int page, @RequestParam(defaultValue = "10") int pageSize, @RequestParam(required = false) String keyword, @RequestParam(defaultValue = "all") String status, @RequestParam(defaultValue = "createTime") String sortBy, @RequestParam(defaultValue = "desc") String sortOrder) { return service.page(page, pageSize, keyword, status, sortBy, sortOrder); }
    @GetMapping("/{id}") public AdminVideoVO detail(@PathVariable Long id) { return service.detail(id); }
    @PostMapping public ResponseEntity<AdminVideoVO> create(@Valid @RequestBody AdminVideoRequest request) { AdminVideoVO vo = service.create(request); return ResponseEntity.created(URI.create("/api/admin/videos/" + vo.id())).body(vo); }
    @PutMapping("/{id}") public AdminVideoVO update(@PathVariable Long id, @Valid @RequestBody AdminVideoRequest request) { return service.update(id, request); }
    @PostMapping("/{id}/copies") public ResponseEntity<AdminVideoVO> copy(@PathVariable Long id) { AdminVideoVO vo = service.copy(id); return ResponseEntity.created(URI.create("/api/admin/videos/" + vo.id())).body(vo); }
    @DeleteMapping("/{id}") public ResponseEntity<Void> delete(@PathVariable Long id) { service.delete(id); return ResponseEntity.noContent().build(); }
    @PatchMapping("/{id}") public AdminVideoVO restore(@PathVariable Long id, @Valid @RequestBody AdminRestoreRequest request) { return service.restore(id); }
}
