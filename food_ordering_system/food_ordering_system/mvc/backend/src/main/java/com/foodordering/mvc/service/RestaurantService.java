package com.foodordering.mvc.service;

import com.foodordering.mvc.model.Restaurant;
import com.foodordering.mvc.repository.RestaurantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RestaurantService {

    @Autowired
    private RestaurantRepository repository;

    // CREATE
    public Restaurant addRestaurant(Restaurant restaurant) {
        return repository.save(restaurant);
    }

    // READ ALL
    public List<Restaurant> getAllRestaurants() {
        return repository.findAll();
    }

    // READ BY ID
    public Restaurant getRestaurantById(String id) {
        return repository.findById(id).orElse(null);
    }

    // UPDATE  👈 PUT IT HERE
    public Restaurant updateRestaurant(String id, Restaurant updatedRestaurant) {

        Restaurant existingRestaurant =
                repository.findById(id).orElse(null);

        if (existingRestaurant != null) {

            existingRestaurant.setName(updatedRestaurant.getName());
            existingRestaurant.setAddress(updatedRestaurant.getAddress());
            existingRestaurant.setPhone(updatedRestaurant.getPhone());
            existingRestaurant.setImage(updatedRestaurant.getImage());
            return repository.save(existingRestaurant);
        }

        return null;
    }

    // DELETE
    public void deleteRestaurant(String id) {
        repository.deleteById(id);
    }
}