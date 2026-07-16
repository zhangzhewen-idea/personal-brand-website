package com.zhangzhewen.pbw.adapter.admin;

import com.zhangzhewen.pbw.application.AdminFileApplicationService;
import com.zhangzhewen.pbw.application.dto.admin.AdminCommonDto.AdminFileVO;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.URI;

@Tag(name = "管理员文件")
@RestController
@RequestMapping("/api/admin/files")
public class AdminFileController {
    private final AdminFileApplicationService service;
    public AdminFileController(AdminFileApplicationService service) { this.service = service; }
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<AdminFileVO> upload(@RequestParam MultipartFile file, @RequestParam String mediaType) throws IOException {
        AdminFileVO vo = service.upload(file.getOriginalFilename(), file.getContentType(), file.getSize(), mediaType, file.getInputStream());
        return ResponseEntity.created(URI.create(vo.url())).body(vo);
    }
}
