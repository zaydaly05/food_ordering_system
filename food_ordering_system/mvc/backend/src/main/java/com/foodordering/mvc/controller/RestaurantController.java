package com.foodordering.mvc.controller;

import com.foodordering.mvc.service.RestaurantService;
import com.foodordering.mvc.model.Restaurant;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/restaurants")
@CrossOrigin(origins = "*")
public class RestaurantController {

    @Autowired
    private RestaurantService service;

    // CREATE
    @PostMapping
    public Restaurant addRestaurant(@RequestBody Restaurant restaurant) {
        return service.addRestaurant(restaurant);
    }

    // READ ALL
    @GetMapping("/all")
    public List<Restaurant> getAllRestaurants() {
        return service.getAllRestaurants();
    }

    // READ BY ID
    @GetMapping("/{id}")
    public Restaurant getRestaurantById(@PathVariable String id) {
        return service.getRestaurantById(id);
    }

    // UPDATE
    @PutMapping("/{id}")
    public Restaurant updateRestaurant(
            @PathVariable String id,
            @RequestBody Restaurant restaurant) {

        return service.updateRestaurant(id, restaurant);
    }

    // DELETE
    @DeleteMapping("/{id}")
    public void deleteRestaurant(@PathVariable String id) {
        service.deleteRestaurant(id);
    }
}