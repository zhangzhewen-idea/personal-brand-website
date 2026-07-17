package com.zhangzhewen.pbw;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;
import org.junit.jupiter.api.TestMethodOrder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.testcontainers.containers.GenericContainer;
import org.testcontainers.containers.MySQLContainer;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
class ApiIntegrationTest {

    private static final MySQLContainer MYSQL = new MySQLContainer("mysql:8.4");
    private static final GenericContainer<?> REDIS = new GenericContainer<>("redis:7.4-alpine").withExposedPorts(6379);

    static {
        MYSQL.start();
        REDIS.start();
    }

    @DynamicPropertySource
    static void properties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", () -> MYSQL.getJdbcUrl() + "?serverTimezone=GMT%2B8");
        registry.add("spring.datasource.username", MYSQL::getUsername);
        registry.add("spring.datasource.password", MYSQL::getPassword);
        registry.add("spring.data.redis.host", REDIS::getHost);
        registry.add("spring.data.redis.port", () -> REDIS.getMappedPort(6379));
        registry.add("pbw.storage.root", () -> System.getProperty("java.io.tmpdir") + "/pbw-test-uploads");
    }

    @Autowired MockMvc mockMvc;
    @Autowired ObjectMapper objectMapper;
    private String adminToken;

    @BeforeAll
    void login() throws Exception {
        adminToken = tokenFor("/api/admin/session", "admin", "123456");
    }

    @Test
    @Order(1)
    void securityDistinguishesUnauthenticatedAndWrongRole() throws Exception {
        mockMvc.perform(get("/api/admin/videos"))
                .andExpect(status().isUnauthorized())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_PROBLEM_JSON))
                .andExpect(jsonPath("$.code").value("UNAUTHORIZED"));

        String userToken = tokenFor("/api/user/session", "movie_fan", "123456");
        mockMvc.perform(get("/api/admin/videos").header("Authorization", "Bearer " + userToken))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.code").value("FORBIDDEN"));
    }

    @Test
    @Order(2)
    void adminSessionAndReservedRoleColumnWorkWithoutLeakingPasswords() throws Exception {
        mockMvc.perform(get("/api/admin/session").header("Authorization", bearer()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.account").value("admin"))
                .andExpect(jsonPath("$.role").value("管理员"));

        String users = mockMvc.perform(get("/api/admin/users").header("Authorization", bearer()).param("sortBy", "role"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.total").value(3))
                .andReturn().getResponse().getContentAsString();
        JsonNode userList = objectMapper.readTree(users).path("list");
        userList.forEach(user -> {
            assertThat(user.has("password")).isFalse();
            assertThat(user.has("passwordHash")).isFalse();
        });
    }

    @Test
    @Order(3)
    void videoCrudIsIdempotentAndDeleteRestoreAreRepeatable() throws Exception {
        String request = """
                {"videoTitle":"测试视频","videoIntro":"接口测试","videoUrl":"https://cdn.example.com/videos/test.mp4","videoCover":null}
                """;
        String first = mockMvc.perform(post("/api/admin/videos")
                        .header("Authorization", bearer()).header("Idempotency-Key", "video-create-1")
                        .contentType(MediaType.APPLICATION_JSON).content(request))
                .andExpect(status().isCreated())
                .andExpect(header().string("Location", org.hamcrest.Matchers.matchesPattern("/api/admin/videos/[0-9]+")))
                .andReturn().getResponse().getContentAsString();
        String second = mockMvc.perform(post("/api/admin/videos")
                        .header("Authorization", bearer()).header("Idempotency-Key", "video-create-1")
                        .contentType(MediaType.APPLICATION_JSON).content(request))
                .andExpect(status().isCreated()).andReturn().getResponse().getContentAsString();
        long id = objectMapper.readTree(first).path("id").asLong();
        assertThat(objectMapper.readTree(second).path("id").asLong()).isEqualTo(id);

        mockMvc.perform(put("/api/admin/videos/{id}", id).header("Authorization", bearer()).contentType(MediaType.APPLICATION_JSON)
                        .content("{\"videoTitle\":\"测试视频更新\",\"videoIntro\":null,\"videoUrl\":\"https://cdn.example.com/videos/test.mp4\",\"videoCover\":null}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.videoIntro").doesNotExist())
                .andExpect(jsonPath("$.videoCover").doesNotExist());

        mockMvc.perform(delete("/api/admin/videos/{id}", id).header("Authorization", bearer())).andExpect(status().isNoContent());
        mockMvc.perform(delete("/api/admin/videos/{id}", id).header("Authorization", bearer())).andExpect(status().isNoContent());
        mockMvc.perform(patch("/api/admin/videos/{id}", id).header("Authorization", bearer()).contentType(MediaType.APPLICATION_JSON).content("{\"isDeleted\":false}"))
                .andExpect(status().isOk()).andExpect(jsonPath("$.isDeleted").value(false));
    }

    @Test
    @Order(4)
    void validationUsesProblemDetailsAndUserContentHidesManagementFields() throws Exception {
        mockMvc.perform(post("/api/admin/videos").header("Authorization", bearer()).contentType(MediaType.APPLICATION_JSON)
                        .content("{\"videoTitle\":\" \",\"videoUrl\":\"not-a-url\"}"))
                .andExpect(status().isUnprocessableContent())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_PROBLEM_JSON))
                .andExpect(jsonPath("$.code").value("VALIDATION_ERROR"));

        String courses = mockMvc.perform(get("/api/user/courses"))
                .andExpect(status().isOk()).andExpect(jsonPath("$.length()").value(2))
                .andReturn().getResponse().getContentAsString();
        assertThat(courses).doesNotContain("isDeleted", "isOnline", "createTime", "updateTime");
    }

    @Test
    @Order(5)
    void openApi31IsPublished() throws Exception {
        mockMvc.perform(get("/v3/api-docs"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.openapi").value(org.hamcrest.Matchers.startsWith("3.1")))
                .andExpect(jsonPath("$.paths['/api/admin/videos']").exists())
                .andExpect(jsonPath("$.paths['/api/user/courses']").exists());
    }

    private String tokenFor(String path, String account, String password) throws Exception {
        String json = mockMvc.perform(post(path).contentType(MediaType.APPLICATION_JSON)
                        .content("{\"account\":\"" + account + "\",\"password\":\"" + password + "\"}"))
                .andExpect(status().isOk()).andReturn().getResponse().getContentAsString();
        JsonNode node = objectMapper.readTree(json);
        return node.path("token").asText();
    }

    private String bearer() {
        return "Bearer " + adminToken;
    }
}