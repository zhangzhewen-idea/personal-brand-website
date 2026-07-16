package com.zhangzhewen.pbw;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@MapperScan("com.zhangzhewen.pbw.infrastructure.persistence.mapper")
@SpringBootApplication
public class PbwApplication {

    public static void main(String[] args) {
        SpringApplication.run(PbwApplication.class, args);
    }
}
