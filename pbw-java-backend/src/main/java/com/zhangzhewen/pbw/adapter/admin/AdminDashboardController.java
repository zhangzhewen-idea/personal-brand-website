package com.zhangzhewen.pbw.adapter.admin;

import com.zhangzhewen.pbw.application.AdminDashboardApplicationService;
import com.zhangzhewen.pbw.application.dto.admin.AdminDashboardDto.AdminDashboardVO;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "管理员工作台")
@RestController
@RequestMapping("/api/admin/dashboard")
public class AdminDashboardController {
    private final AdminDashboardApplicationService service;
    public AdminDashboardController(AdminDashboardApplicationService service) { this.service = service; }
    @GetMapping public AdminDashboardVO dashboard(@RequestParam(defaultValue = "30") int trendDays, @RequestParam(defaultValue = "3") int latestVideoLimit) { return service.dashboard(trendDays, latestVideoLimit); }
}
