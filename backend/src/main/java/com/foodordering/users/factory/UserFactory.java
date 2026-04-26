package com.foodordering.users.factory;

import com.foodordering.users.model.UserAccount;

public interface UserFactory<T extends UserAccount> {
    T create();
}
