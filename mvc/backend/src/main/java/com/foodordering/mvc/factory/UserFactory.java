package com.foodordering.mvc.factory;

import com.foodordering.mvc.model.UserAccount;

public interface UserFactory<T extends UserAccount> {
    T create();
}

