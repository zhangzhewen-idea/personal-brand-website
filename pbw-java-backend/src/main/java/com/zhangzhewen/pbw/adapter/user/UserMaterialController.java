package com.zhangzhewen.pbw.adapter.user;

import com.zhangzhewen.pbw.application.UserContentApplicationService;
import com.zhangzhewen.pbw.application.dto.user.UserContentDto.UserMaterialVO;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Tag(name = "用户端素材")
@Validated
@RestController
@RequestMapping("/api/user/materials")
public class UserMaterialController {
    private final UserContentApplicationService service;

    public UserMaterialController(UserContentApplicationService service) {
        this.service = service;
    }

    @GetMapping
    public List<UserMaterialVO> materials(@RequestParam(defaultValue = "20") @Min(1) @Max(100) int limit) {
        return service.materials(limit);
    }
}
