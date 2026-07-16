package com.zhangzhewen.pbw.domain.gateway;

import java.util.Optional;

public interface CurrentActorGateway {
    Optional<Long> currentUserId();

    Optional<String> currentTokenId();
}
