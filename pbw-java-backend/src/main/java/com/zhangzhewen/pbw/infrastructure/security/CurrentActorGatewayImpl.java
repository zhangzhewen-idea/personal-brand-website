package com.zhangzhewen.pbw.infrastructure.security;

import com.zhangzhewen.pbw.domain.gateway.CurrentActorGateway;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class CurrentActorGatewayImpl implements CurrentActorGateway {
    @Override public Optional<Long> currentUserId() { return principal().map(PbwPrincipal::userId); }
    @Override public Optional<String> currentTokenId() { return principal().map(PbwPrincipal::tokenId); }

    private Optional<PbwPrincipal> principal() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication != null && authentication.getPrincipal() instanceof PbwPrincipal principal ? Optional.of(principal) : Optional.empty();
    }
}
