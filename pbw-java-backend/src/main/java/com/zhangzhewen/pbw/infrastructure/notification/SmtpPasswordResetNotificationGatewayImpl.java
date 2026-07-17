package com.zhangzhewen.pbw.infrastructure.notification;

import com.zhangzhewen.pbw.domain.gateway.PasswordResetNotificationGateway;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.time.Duration;

@Component
public class SmtpPasswordResetNotificationGatewayImpl implements PasswordResetNotificationGateway {
    private final JavaMailSenderImpl mailSender;
    private final String from;
    private final String resetPageUrl;

    public SmtpPasswordResetNotificationGatewayImpl(
            @Value("${spring.mail.host}") String host,
            @Value("${spring.mail.port}") int port,
            @Value("${spring.mail.username:}") String username,
            @Value("${spring.mail.password:}") String password,
            @Value("${spring.mail.properties.mail.smtp.auth:false}") boolean auth,
            @Value("${spring.mail.properties.mail.smtp.starttls.enable:false}") boolean startTls,
            @Value("${pbw.user.password-reset-from}") String from,
            @Value("${pbw.user.password-reset-page-url}") String resetPageUrl
    ) {
        this.mailSender = new JavaMailSenderImpl();
        this.mailSender.setHost(host);
        this.mailSender.setPort(port);
        if (!username.isBlank()) this.mailSender.setUsername(username);
        if (!password.isBlank()) this.mailSender.setPassword(password);
        this.mailSender.getJavaMailProperties().setProperty("mail.smtp.auth", String.valueOf(auth));
        this.mailSender.getJavaMailProperties().setProperty("mail.smtp.starttls.enable", String.valueOf(startTls));
        this.from = from;
        this.resetPageUrl = resetPageUrl;
    }

    @Override
    public void send(String email, String nickname, String resetToken, Duration validFor) {
        String resetUrl = UriComponentsBuilder.fromUriString(resetPageUrl)
                .queryParam("resetToken", resetToken)
                .build()
                .encode()
                .toUriString();
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(from);
        message.setTo(email);
        message.setSubject("影像创作者账号密码重置");
        message.setText("你好，" + nickname + "：\n\n请在 " + validFor.toMinutes() + " 分钟内通过以下链接重置密码：\n" + resetUrl + "\n\n如果不是你本人操作，请忽略此邮件。");
        mailSender.send(message);
    }
}
