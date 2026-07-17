package com.zhangzhewen.pbw;

import com.zhangzhewen.pbw.domain.gateway.SessionGateway;
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

import java.time.Duration;

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
    @Autowired SessionGateway sessionGateway;
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
                {"videoTitle":"测试视频","videoIntro":"接口测试","videoUrl":"/videos/test.mp4","videoCover":null}
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
                        .content("{\"videoTitle\":\"测试视频更新\",\"videoIntro\":null,\"videoUrl\":\"/videos/test.mp4\",\"videoCover\":null}"))
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

        mockMvc.perform(get("/api/user/videos").param("limit", "100"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[?(@.platformName == '抖音')]").isNotEmpty())
                .andExpect(jsonPath("$[?(@.playCountText == '180万')]").isNotEmpty());

        mockMvc.perform(get("/api/user/videos").param("limit", "0"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.code").value("BAD_REQUEST"));

        String materials = mockMvc.perform(get("/api/user/materials"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(4))
                .andExpect(jsonPath("$[?(@.isFree == true)].netdiskUrl").isNotEmpty())
                .andExpect(jsonPath("$[0].colorClass").isNotEmpty())
                .andExpect(jsonPath("$[0].iconName").isNotEmpty())
                .andReturn().getResponse().getContentAsString();
        objectMapper.readTree(materials).forEach(material -> {
            if (!material.path("isFree").asBoolean()) {
                assertThat(material.path("netdiskUrl").isNull()).isTrue();
            }
        });

        mockMvc.perform(get("/api/user/matrix-accounts"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(4))
                .andExpect(jsonPath("$[0].followerCountText").isNotEmpty())
                .andExpect(jsonPath("$[0].colorClass").isNotEmpty());

        String courses = mockMvc.perform(get("/api/user/courses"))
                .andExpect(status().isOk()).andExpect(jsonPath("$.length()").value(4))
                .andExpect(jsonPath("$[?(@.isOnline == false)]").isNotEmpty())
                .andExpect(jsonPath("$[0].features").isArray())
                .andExpect(jsonPath("$[0].lessonCount").isNumber())
                .andReturn().getResponse().getContentAsString();
        assertThat(courses).doesNotContain("isDeleted", "createTime", "updateTime", "userVisible");

        mockMvc.perform(get("/api/user/basic-info"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalPlayCount").value(12800000))
                .andExpect(jsonPath("$.annualTop10Films").isArray());
    }

    @Test
    @Order(5)
    void userSessionCanBeRestoredAndRevoked() throws Exception {
        String userToken = tokenFor("/api/user/session", "movie_fan", "123456");
        mockMvc.perform(get("/api/user/session").header("Authorization", "Bearer " + userToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.account").value("movie_fan"))
                .andExpect(jsonPath("$.role").value("用户"))
                .andExpect(jsonPath("$.password").doesNotExist());

        mockMvc.perform(delete("/api/user/session").header("Authorization", "Bearer " + userToken))
                .andExpect(status().isNoContent());
        mockMvc.perform(get("/api/user/session").header("Authorization", "Bearer " + userToken))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @Order(6)
    void userRegistrationCreatesSessionAndRejectsDuplicateAccount() throws Exception {
        String body = """
                {"nickname":"新用户","account":"new_user_2026","email":"NEW.USER@example.com","password":"Register2026"}
                """;
        mockMvc.perform(post("/api/user/users").contentType(MediaType.APPLICATION_JSON).content(body))
                .andExpect(status().isCreated())
                .andExpect(header().string("Location", org.hamcrest.Matchers.matchesPattern("/api/user/users/[0-9]+")))
                .andExpect(jsonPath("$.token").isNotEmpty())
                .andExpect(jsonPath("$.user.email").value("new.user@example.com"))
                .andExpect(jsonPath("$.user.role").value("用户"));

        mockMvc.perform(post("/api/user/users").contentType(MediaType.APPLICATION_JSON).content(body))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.code").value("RESOURCE_CONFLICT"))
                .andExpect(jsonPath("$.fieldErrors[0].field").value("account"));

        tokenFor("/api/user/session", "new_user_2026", "Register2026");
    }

    @Test
    @Order(7)
    void userPasswordResetUsesOneTimeTokenAndRevokesExistingSessions() throws Exception {
        String activeToken = tokenFor("/api/user/session", "movie_fan", "123456");

        mockMvc.perform(post("/api/user/password-reset-requests").contentType(MediaType.APPLICATION_JSON)
                        .content("{\"accountOrEmail\":\"not-found@example.com\"}"))
                .andExpect(status().isAccepted())
                .andExpect(jsonPath("$.message").value("发送成功"));

        mockMvc.perform(post("/api/user/password-reset-requests").contentType(MediaType.APPLICATION_JSON)
                        .content("{\"accountOrEmail\":\"movie_fan\"}"))
                .andExpect(status().isAccepted())
                .andExpect(jsonPath("$.message").value("发送成功"));

        sessionGateway.savePasswordResetToken("upr_integration_test", 2L, Duration.ofMinutes(15));
        mockMvc.perform(post("/api/user/password-resets").contentType(MediaType.APPLICATION_JSON)
                        .content("{\"resetToken\":\"upr_integration_test\",\"newPassword\":\"Changed2026\"}"))
                .andExpect(status().isNoContent());

        mockMvc.perform(get("/api/user/session").header("Authorization", "Bearer " + activeToken))
                .andExpect(status().isUnauthorized());
        tokenFor("/api/user/session", "movie_fan", "Changed2026");

        mockMvc.perform(post("/api/user/password-resets").contentType(MediaType.APPLICATION_JSON)
                        .content("{\"resetToken\":\"upr_integration_test\",\"newPassword\":\"ChangedAgain2026\"}"))
                .andExpect(status().isUnprocessableContent())
                .andExpect(jsonPath("$.code").value("INVALID_RESET_TOKEN"));
    }

    @Test
    @Order(8)
    void openApi31IsPublished() throws Exception {
        mockMvc.perform(get("/v3/api-docs"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.openapi").value(org.hamcrest.Matchers.startsWith("3.1")))
                .andExpect(jsonPath("$.paths['/api/admin/videos']").exists())
                .andExpect(jsonPath("$.paths['/api/user/courses']").exists())
                .andExpect(jsonPath("$.paths['/api/user/session'].get").exists())
                .andExpect(jsonPath("$.paths['/api/user/session'].delete").exists())
                .andExpect(jsonPath("$.paths['/api/user/password-resets']").exists());
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
