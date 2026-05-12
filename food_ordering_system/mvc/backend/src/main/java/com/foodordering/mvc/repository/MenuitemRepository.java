package com.foodordering.mvc.repository;

import com.foodordering.mvc.model.Menuitem;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface MenuitemRepository
        extends MongoRepository<Menuitem, String> {

    List<Menuitem> findByRestaurantId(String restaurantId);
}