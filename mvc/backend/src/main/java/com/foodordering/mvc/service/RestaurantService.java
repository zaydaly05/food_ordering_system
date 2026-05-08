package com.foodordering.mvc.service;
import com.foodordering.mvc.repository.RestaurantRepository;
import com.foodordering.mvc.model.Restaurant;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RestaurantService {

    @Autowired
    private RestaurantRepository repository;

    public Restaurant addRestaurant(Restaurant restaurant) {
        return repository.save(restaurant);
    }

    public List<Restaurant> getAllRestaurants() {
        return repository.findAll();
    }

    public Restaurant getRestaurantById(String id) {
        return repository.findById(id).orElse(null);
    }

    public void deleteRestaurant(String id) {
        repository.deleteById(id);
    }
}