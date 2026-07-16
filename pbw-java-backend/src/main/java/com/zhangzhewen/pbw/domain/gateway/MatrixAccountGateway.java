package com.zhangzhewen.pbw.domain.gateway;

import com.zhangzhewen.pbw.domain.content.MatrixAccount;

import java.util.List;

public interface MatrixAccountGateway extends ManagedResourceGateway<MatrixAccount> {
    List<MatrixAccount> listActive();
}
