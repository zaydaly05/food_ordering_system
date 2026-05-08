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

    @PostMapping
    public Restaurant addRestaurant(@RequestBody Restaurant restaurant) {
        return service.addRestaurant(restaurant);
    }

    @GetMapping("/all")
    public List<Restaurant> getAllRestaurants() {
        return service.getAllRestaurants();
    }

    @GetMapping("/{id}")
    public Restaurant getRestaurantById(@PathVariable String id) {
        return service.getRestaurantById(id);
    }
}